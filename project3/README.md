# Project 3

Web Programming with Python and JavaScript

## Pinocchios Pizza

### Installation steps:
    install python 3 </br>
    run command "pip install -r requirements.txt" </br>
    run "python manage.py makemigrations" </br>
    run "python manage.py migrate" </br>
    run "python manage.py runserver" </br>

### Installation steps for heroku:
    add Prockfile with following data web: gunicorn <project name>.wsgi:application --log-file - --log-level debug
    add below lines at end of the settings.py to handle static files
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    try:
        import dj_database_url 
        prod_db  =  dj_database_url.config(conn_max_age=500)
        DATABASES['default'].update(prod_db)
        django_heroku.settings(locals())
    except:
        print("")
    
    add below line to Middleware in settings.py after security middleware 
    'whitenoise.middleware.WhiteNoiseMiddleware',
    
    execute heroku login | heroku create <appname> | git init |git add . | git commit -m "initial" | heroku git:remote -a <appname>|git push heroku master 

    update ALLOWED_HOSTS = ['<appname>.herokuapp.com','127.0.0.1','0.0.0.0', 'localhost'] 

    execute heroku addons:create heroku-postgresql:hobby-dev 
    to initialize heroku postgres DB 

    execute heroku pg:info  
    to get heroku postgres DB information 

    execute heroku run python3 manage.py migrate 
    for initializing all the tables of django app in heroku DB

### To Copy Data from sqlite3 to heroku DB
    execute python3 manage.py dumpdata --exclude contenttypes > data.json
    to create a json file of your db and do git push to heroku master 

    execute heroku run python3 manage.py migrate
    to make sure everything is there

    execute heroku run python3 manage.py loaddata data.json
    if any error comes check if strucutre of data.json file is proper in below format and run above commands again from git push
    [
        {
            "pk": "4b678b301dfd8a4e0dad910de3ae245b",
            "model": "sessions.session",
            "fields": {
                "expire_date": "2013-01-16T08:16:59.844Z",
                ...
            }
        }
    ]

    execute heroku open 
    to see your website

### Links Used

    https://devcenter.heroku.com/articles/getting-started-with-python#start-a-console

    https://devcenter.heroku.com/articles/django-app-configuration

    https://devcenter.heroku.com/articles/django-assets

    https://tutorial-extensions.djangogirls.org/en/heroku/

    https://stackoverflow.com/questions/55813584/django-whitenoise-configuration-is-incompatible-with-whitenoise-v4-0

    https://stackoverflow.com/questions/58908100/how-to-sync-local-django-sqlite3-data-with-herokus-postgres-database
