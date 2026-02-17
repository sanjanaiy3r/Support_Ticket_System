import json
import os

from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Avg
from django.utils.timezone import now
from datetime import timedelta

from .models import Ticket
from .serializers import TicketSerializer

from google import genai


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get("category")
        priority = self.request.query_params.get("priority")
        status_param = self.request.query_params.get("status")

        if category:
            queryset = queryset.filter(category=category)

        if priority:
            queryset = queryset.filter(priority=priority)

        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset.order_by("-created_at")

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.status_code = status.HTTP_201_CREATED
        return response

    # -----------------------------
    # STATS ENDPOINT
    # -----------------------------
    @action(detail=False, methods=["get"])
    def stats(self, request):

        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status="open").count()

        thirty_days_ago = now() - timedelta(days=30)

        avg_per_day = (
            Ticket.objects
            .filter(created_at__gte=thirty_days_ago)
            .values("created_at__date")
            .annotate(count=Count("id"))
            .aggregate(avg=Avg("count"))["avg"]
        ) or 0

        priority_breakdown = dict(
            Ticket.objects
            .values("priority")
            .annotate(count=Count("id"))
            .values_list("priority", "count")
        )

        category_breakdown = dict(
            Ticket.objects
            .values("category")
            .annotate(count=Count("id"))
            .values_list("category", "count")
        )

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })

    # -----------------------------
    # CLASSIFY ENDPOINT (GEMINI NEW SDK)
    # -----------------------------
    @action(detail=False, methods=["post"])
    def classify(self, request):

        description = request.data.get("description")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.environ.get("GEMINI_API_KEY")

        if not api_key:
            # graceful fallback
            return Response({
                "suggested_category": None,
                "suggested_priority": None
            })

        try:
            client = genai.Client(api_key=api_key)

            prompt = f"""
You are a support ticket classifier API.

Allowed categories:
billing
technical
account
general

Allowed priorities:
low
medium
high
critical

Respond ONLY with raw JSON.
No markdown.
No explanation.
No backticks.

Format:
{{"category":"billing","priority":"high"}}

Ticket:
{description}
"""

            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )

            raw_text = response.text.strip()
            print("RAW GEMINI RESPONSE:", raw_text)


            # Extract JSON safely even if model adds extra text
            start = raw_text.find("{")
            end = raw_text.rfind("}") + 1
            json_string = raw_text[start:end]

            parsed = json.loads(json_string)

            category = parsed.get("category", "").lower()
            priority = parsed.get("priority", "").lower()

            valid_categories = ["billing", "technical", "account", "general"]
            valid_priorities = ["low", "medium", "high", "critical"]

            if category not in valid_categories:
                category = None

            if priority not in valid_priorities:
                priority = None

            return Response({
                "suggested_category": category,
                "suggested_priority": priority
            })

        except Exception as e:
            print("GEMINI ERROR:", e)

            return Response({
                "suggested_category": None,
                "suggested_priority": None
            })
