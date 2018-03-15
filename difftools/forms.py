from django import forms

class UploadFileForm(forms.Form):
    file1 = forms.FileField(label="")
    file2 = forms.FileField(label="")

class FileFieldForm(forms.Form):
    file_field = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))