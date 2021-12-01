from app.main import app

if __name__ == '__main__':
   app.config['TEMPLATES_AUTO_RELOAD'] = True
   app.config['DEVELOPMENT'] = True
   app.run(threaded=True, port=5000)