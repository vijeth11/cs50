from random import random
from django.shortcuts import redirect, render
from markdown2 import Markdown
import random

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "title":"All Pages"
    })

def wiki(request,entry):
    data = util.get_entry(entry)    
    if data is not None:
        markdowner = Markdown()
        html = markdowner.convert(data)
        return render(request, "encyclopedia/entry.html", {
            "Title":entry,
            "data":html,
            "error":False
        })
    else:
        error = '''<div style="text-align: center;">
                    <h2 style="color: red;">Error !!!</h2>
                    <h4 style="color: #f5ec0f;">The page with this Title(\''''+entry+'''\') Not Found</h4>
                    </div>'''
        return render(request, "encyclopedia/entry.html", {
            "Title":entry,
            "data":error,
            "error":True
        })

def search(request):
    query = request.GET['q']
    data = util.get_entry(query)
    if data is not None:
        return redirect('wiki',entry = query)
    else:
        return render(request, "encyclopedia/index.html", {
        "entries": [entry for entry in util.list_entries() if query.lower()  in entry.lower()],
        "title":'Related Pages to "'+query+'"'
    })

def randompage(request):
    entries = util.list_entries()
    return redirect('wiki',entry = entries[random.randint(0,len(entries)-1)])

def createNewPage(request):
    if request.method == "POST":
        entries = [entry for entry in util.list_entries() if request.POST["entryname"].lower()  in entry.lower()]
        if len(entries) > 0:
            error = '''<div style="text-align: center;">
                    <h2 style="color: red;">Error !!!</h2>
                    <h4 style="color: #f5ec0f;">The page with this Title(\''''+request.POST["entryname"]+'''\') All Ready Exists</h4>
                    </div>'''
            return render(request, "encyclopedia/entry.html", {
                "Title":request.POST["entryname"],
                "data":error,
                "error":True
            })
        else:
            util.save_entry(request.POST["entryname"],request.POST["content"])
            return redirect('wiki',entry = request.POST["entryname"])
    else:
        return render(request,"encyclopedia/edit.html",{
            "title":"This Page is for Creator's"
        })

def EditExisting(request,entry):
    if request.method == "POST":
        util.save_entry(request.POST["entryname"],request.POST["content"])
        return redirect('wiki',entry = request.POST["entryname"])
    else:
        data = util.get_entry(entry)
        if  data is not None:
            return render(request,"encyclopedia/edit.html",{
                "title":"This Page is for Editor's",
                "entryname":entry,
                "content":data
            })
        else:
            error = '''<div style="text-align: center;">
                    <h2 style="color: red;">Error !!!</h2>
                    <h4 style="color: #f5ec0f;">The page with this Title(\''''+request.POST["entryname"]+'''\') Not Found Please Create</h4>
                    </div>'''
            return render(request, "encyclopedia/entry.html", {
                "Title":request.POST["entryname"],
                "data":error,
                "error":True
            })