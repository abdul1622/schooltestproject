from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _
class Response(TextChoices):
    SUCCESS='success',_('success')