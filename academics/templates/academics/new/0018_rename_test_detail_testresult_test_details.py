# Generated by Django 3.2.13 on 2022-09-26 06:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0017_rename_test_details_testresult_test_detail'),
    ]

    operations = [
        migrations.RenameField(
            model_name='testresult',
            old_name='test_detail',
            new_name='test_details',
        ),
    ]