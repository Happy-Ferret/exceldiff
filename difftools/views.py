from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import UploadFileForm
from .utils import handle_uploaded_file
from .utils import execute_diff
from django.core.urlresolvers import reverse
from Netease.settings import BASE_DIR
import shutil

from django.views.generic.edit import FormView
from .forms import FileFieldForm

# Create your views here.
def success(request):
    results = execute_diff("xlsx")
    urls = []
    context = {}
    if len(results):
        for enum, i in enumerate(results[0]):
            urls.append((i,reverse('tables', args=[enum])))
        context = {
            "back": reverse('index'),
            "delete": results[1],
            "insert": results[2],
            "urls": urls,
            "samefile": False
        }
    else:
        context = {
            "back": reverse('index'),
            "delete": [],
            "insert": [],
            "urls": [],
            "samefile": True
        }
    return render(request, "success.html", context)

def table(request, id):
    context = {"index": reverse('index'), "id": id, "back": reverse("success")}
    return render(request, "tables.html", context)

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES.get("file1"), 1)
            handle_uploaded_file(request.FILES.get("file2"), 2)
            return HttpResponseRedirect(reverse('success'))
    else:
        form = UploadFileForm()
    return render(request, 'upload.html', {'form': form})
