from django.urls import path
<<<<<<< HEAD
from .views import *
urlpatterns=[
    path('subjects/',SubjectCreate.as_view()),
    path('grades/',GradeView.as_view()),
    path('subjects/<int:pk>/',SubjectEditView.as_view()),
    path('chapters/',ChaptersView.as_view()),
    path('chapter/<int:pk>/',ChapterEditView.as_view()),
    path('',ChaptersOfSubjectsView.as_view()),
    path('question/',QuestionAddView.as_view()),
    path('questionsap/',QuestionsView.as_view())
=======
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
>>>>>>> 61e4d3f985c9c8ac868ca25a1de9e0b31bb93907
]