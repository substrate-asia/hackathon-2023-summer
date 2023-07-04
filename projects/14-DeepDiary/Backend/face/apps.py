# face/apps.py
from django.apps import AppConfig


class FaceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'face'

    def ready(self):
        import face.signals
