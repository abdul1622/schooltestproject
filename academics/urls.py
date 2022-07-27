from django.urls import path
from .views import ( 
    GradeView, 
    GradeEditView,
    SubjectCreateView,
    SubjectEditView,
    ChaptersCreateView,
    ChapterEditView,
    ChapterListView,
    SubjectListView,
    QuestionCreateView,
    QuestionEditView,
    QuestionList,
    QuestionPaperView,
    QuestionPaperList,
    load_subject_chapter,
    TestCreateView,
    TestEditView,
)

urlpatterns=[
    path('subjects/',SubjectCreateView.as_view()),
    path('grades/',GradeView.as_view()),
    path('grades/<int:pk>/',GradeEditView.as_view()),
    path('chapters/',ChaptersCreateView.as_view()),
    path('subjects/<int:pk>/',SubjectEditView.as_view()),
    path('chapters/<int:pk>/',ChapterEditView.as_view()),
    path('chapter-list/',ChapterListView.as_view()),
    path('subject-list/',SubjectListView.as_view()),
    path('question/',QuestionCreateView.as_view()),
    path('question/<int:pk>/',QuestionEditView.as_view()),
    path('question-paper/',QuestionList.as_view()),
    path('question-paper-list/',QuestionPaperList.as_view()),
    path('question-paper/<int:pk>/',QuestionPaperView.as_view()),
         path('test/',TestCreateView.as_view()),
    path('test/<int:pk>/',TestEditView.as_view()),
            
  
    path('ajax/load-subject/',load_subject_chapter,name='ajax_load_subjects'),
]