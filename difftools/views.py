from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import UploadFileForm
from .utils import handle_uploaded_file
from .utils import execute_diff
from django.core.urlresolvers import reverse

from django.views.generic.edit import FormView
from .forms import FileFieldForm

# Create your views here.
def success(request):
    execute_diff("xlsx")
    context = {"continue": reverse('tables'), "back": reverse('index')}
    return render(request, "success.html", context)

def table(request):
    context = {}
    context = {"back": reverse('index')}
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
