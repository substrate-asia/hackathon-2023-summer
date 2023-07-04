# import django
#
# # Create your tests here.
# import os
#
# from django_oss_storage.backends import OssStorage
# from django_redis import get_redis_connection
#
# from deep_diary import settings
# from deep_diary.config import api_key, api_secret
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deep_diary.settings')
# django.setup()
#
#
# def test_initial_storage(self):
#     # unconnect original DEFAULT_FILE_STORAGE
#     with self.settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage'):
#         storage_with_populated_arguments = OssStorage(
#             access_key_id=settings.OSS_ACCESS_KEY_ID,
#             access_key_secret=settings.OSS_ACCESS_KEY_SECRET,
#             end_point=settings.OSS_ENDPOINT,
#             bucket_name=settings.OSS_BUCKET_NAME)
#         self.assertEqual(storage_with_populated_arguments.access_key_id,
#                          settings.OSS_ACCESS_KEY_ID)
#         self.assertEqual(storage_with_populated_arguments.access_key_secret,
#                          settings.OSS_ACCESS_KEY_SECRET)
#         self.assertEqual(storage_with_populated_arguments.end_point.split('//')[-1],
#                          settings.OSS_ENDPOINT.split('//')[-1])
#         self.assertEqual(storage_with_populated_arguments.bucket_name,
#                          settings.OSS_BUCKET_NAME)
#
#         storage_with_default_arguments = OssStorage()
#         self.assertEqual(storage_with_default_arguments.access_key_id,
#                          settings.OSS_ACCESS_KEY_ID)
#         self.assertEqual(storage_with_default_arguments.access_key_secret,
#                          settings.OSS_ACCESS_KEY_SECRET)
#         self.assertEqual(storage_with_default_arguments.end_point.split('//')[-1],
#                          settings.OSS_ENDPOINT.split('//')[-1])
#         self.assertEqual(storage_with_default_arguments.bucket_name,
#                          settings.OSS_BUCKET_NAME)
#
# print('--------------------end---------------------------')
# print(f'\033[1;32m --------INFO:img address have been created to the database-------- \033[0m')
