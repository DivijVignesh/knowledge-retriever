# Generated by Django 4.2.2 on 2024-01-12 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_alter_chatsession_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatsession',
            name='file',
            field=models.FileField(upload_to='./media'),
        ),
    ]
