from django.apps import AppConfig


class LibraryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'library'
    verbose_name = 'Awesome Gallery'
    date_format = 'ddMMYYYY'

    def ready(self):  # 不增加这个函数，信号机制就不会生效
        import library.signals
