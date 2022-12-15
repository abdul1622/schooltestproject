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
    QuestionFromQuestionPaper,
    load_subject_chapter,
    load_grade,
    load_test,
    TestCreateView,
    TestEditView,
    TestResultCreateView,
    TestResultEditView,
    TestInstructionView,
    EditTestInstructionView,

    load_chapter_no,
)

urlpatterns = [
    path('subjects/', SubjectCreateView.as_view()),
    path('grades/', GradeView.as_view()),
    path('grades/<int:pk>/', GradeEditView.as_view()),
    path('chapters/', ChaptersCreateView.as_view()),
    path('subjects/<int:pk>/', SubjectEditView.as_view()),
    path('chapters/<int:pk>/', ChapterEditView.as_view()),
    path('chapter-list/', ChapterListView.as_view()),
    path('subject-list/', SubjectListView.as_view()),
    path('question/', QuestionCreateView.as_view()),
    path('question/<int:pk>/', QuestionEditView.as_view()),
    path('question-paper/', QuestionList.as_view()),
    path('question-paper-list/', QuestionPaperList.as_view()),
    path('question-paper/<int:pk>/', QuestionPaperView.as_view()),
    path('test/', TestCreateView.as_view()),
    path('test/<int:pk>/', TestEditView.as_view()),
    path('test-history/', TestResultCreateView.as_view()),
    path('test-history/<int:pk>/', TestResultEditView.as_view()),
    path('ajax/load-subject/', load_subject_chapter, name='ajax_load_subjects'),
    path('ajax/load-grade/', load_grade),
    path('ajax/load-test/', load_test),
    path('test-questions/', QuestionFromQuestionPaper.as_view()),
    path('instructions/', TestInstructionView.as_view()),
    path('instructions/<int:pk>/', EditTestInstructionView.as_view()),
    # path('a/', update),
    path('ajax/load-chapter-no/', load_chapter_no),
    # path('answer/<int:pk>',GetAnswerView.as_view()),
    # path('q', QuestionList2.as_view()),
]
