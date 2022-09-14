from ast import List
from base64 import standard_b64decode
from operator import truediv
from os import stat
import json
from itertools import chain
from re import sub
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
    ListAPIView,
    RetrieveDestroyAPIView,
)
from accounts.permission import IsAdminUser, IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_206_PARTIAL_CONTENT,
    HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_203_NON_AUTHORITATIVE_INFORMATION, HTTP_204_NO_CONTENT, HTTP_422_UNPROCESSABLE_ENTITY
)
import requests
from .forms import *
from django.conf import settings
from django.core.mail import send_mail
import random
from django.shortcuts import render
from .serializers import (
    SubjectSerializer,
    ChapterSerializer,
    GradeSerializer,
    ChapterViewSerializer,
    QuestionAnswerSerializer,
    QuestionGetSerializer,
    QuestionSerializer,
    QuestionPaperSerializer,
    Question_answer_serializer,
    questionanswerserializer,
    TestSerializer,
    TestResultSerializer,
    TestInstruction,
)
from .models import Question, Subject, Grade, Chapter, Question_Paper, Answers, Questionbank
from accounts.models import User
from .utils import render_to_pdf, render_to_pdf2

# Create your views here.


class GradeView(ListCreateAPIView):
    serializer_class = GradeSerializer
    queryset = Grade.objects.all().order_by('grade')
    permission_classes = [AllowAny]

    def list(self, request):
        user = self.request.user
        queryset = self.get_queryset()
        if user.user_type == 'is_staff':
            grade = user.profile.standard
            queryset = queryset.filter(grade=grade)
        elif user.user_type == 'is_student':
            return Response({"status": "failure", 'data': 'Your not have access to view this page'})
        serializer = GradeSerializer(queryset, many=True)
        return Response({"status": "success", 'data': serializer.data})

    def create(self, request):
        serializer = GradeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class GradeEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = GradeSerializer
    permission_classes = [AllowAny]
    queryset = Grade.objects.all().order_by('grade')

    def retrieve(self, request, pk):
        try:
            queryset = Grade.objects.get(pk=pk)
        except:
            return Response({'status': 'failure', "data": "Grade doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = GradeSerializer(queryset)
        return Response(serializer.data, status=HTTP_200_OK)

    def update(self, request, pk):
        subject = Subject.objects.get(pk=pk)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class SubjectCreateView(ListCreateAPIView):
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all().order_by('grade', 'code')
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            if self.request.user.user_type == 'is_staff':
                user = self.request.user
                gradeid = serializer.data['grade']
                grade = Grade.objects.get(id=gradeid)
                subjects = serializer.data['name']
                admin = User.objects.get(user_type='is_admin')
                subject = 'Subject creation'
                message = f'{user.profile.full_name} HAD CREATED,ON GRADE : {grade.grade} SUBJECT : {subjects}'
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [admin.email, ]
                send_mail(subject, message, email_from, recipient_list)

            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class SubjectEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]
    queryset = Subject.objects.all().order_by('grade', 'code')

    def retrieve(self, request, pk):
        try:
            queryset = Subject.objects.get(pk=pk)
        except:
            return Response({'status': 'failure', "data": "Subject doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = SubjectSerializer(queryset)
        return Response(serializer.data, status=HTTP_200_OK)

    def update(self, request, pk):
        subject = Subject.objects.get(pk=pk)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class ChaptersCreateView(CreateAPIView):

    serializer_class = ChapterSerializer
    queryset = Chapter.objects.all().order_by('subject', 'chapter_no')
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        queryset = Chapter.objects.all().order_by('subject', 'chapter_no')
        serializer = ChapterSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ChapterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class ChapterEditView(RetrieveUpdateDestroyAPIView):

    serializer_class = ChapterSerializer
    permission_classes = [AllowAny]
    queryset = Chapter.objects.all().order_by('subject', 'chapter_no')

    def retrive(self, request, pk):
        try:
            queryset = Chapter.objects.get(pk=pk)
        except:
            return Response({'status': 'failure', "data": "Chapter doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = ChapterSerializer(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        subject = Chapter.objects.get(pk=pk)
        serializer = ChapterSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)

 # class ChapterListView(APIView):
#     serializer_class=ChapterViewSerializer
#     permission_classes=[AllowAny]

#     def post(self,request):
#         grade = request.data.get('grade')
#         subject=(request.data.get('subject')).upper()
#         try:
#             if subject:
#                 data = []
#                grade = Grade.objects.get(grade=grade)
#                 subject = Subject.objects.get(name=subject,grade=grade.grade)
#                 chapters = Chapter.objects.filter(subject=subject)
#                 for object in chapters:
#                     data.append( {
#                     "subject" : subject.name,
#                     "grade" :subject.grade.grade,
#                     "name": object.name,
#                     "chapter_no": object.chapter_no,
#                     "description": object.description,
#                     })
#                 host = request.get_host()
#                 context = {'data':data}
#                 filename,status = render_to_pdf('academics/chapter.html','chapter_files',context)
#                 if not status:
#                     return Response({'status':'given details incorrect'},status=HTTP_206_PARTIAL_CONTENT)

#                 return Response({'path':f'/media/chapter_files/{filename}.pdf'})
#         except:
#             return Response({"status": "Not found"}, status=HTTP_206_PARTIAL_CONTENT)
#         return Response({"status": "failed"}, status=HTTP_206_PARTIAL_CONTENT)


class ChapterListView(APIView):
    serializer_class = ChapterViewSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        grade = request.data.get('grade')
        subject = (request.data.get('subject')).upper()
        try:
            if subject:
                data = []
                grade = Grade.objects.get(grade=grade)
                subject = Subject.objects.get(name=subject, grade=grade.id)
                chapters = (Chapter.objects.filter(subject=subject)
                            ).order_by('subject', 'chapter_no')
                for object in chapters:
                    data.append({
                        "id": object.id,
                        "subject": subject.name,
                        "subject_id": subject.id,
                        "grade": subject.grade.grade,
                        "name": object.name,
                        "chapter_no": object.chapter_no,
                        "description": object.description,
                    })
                return Response({"status": "success", 'data': data})
        except:
            return Response({"status": "Not found"}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "failed"}, status=HTTP_206_PARTIAL_CONTENT)


class SubjectListView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Subject.objects.all()
        grade = self.request.query_params.get('grade')
        if grade is not None:
            try:
                grades = Grade.objects.get(grade=grade)
                queryset = (queryset.filter(grade=grades.id).order_by('code'))
            except:
                return Response({'status': 'failed'}, status=HTTP_206_PARTIAL_CONTENT)
            return queryset

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)


class QuestionCreateView(CreateAPIView):
    serializer_class = QuestionAnswerSerializer
    queryset = Question.objects.all().order_by('grade', 'subject', 'chapter')
    permission_classes = [AllowAny]

    def get(self, request):
        grade = self.request.query_params.get('grade')
        subject = self.request.query_params.get('subject')
        questions = Question.objects.all()
        if grade and subject:
            try:
                questions = Question.objects.filter(grade_id=int(grade),subject_id=int(subject))
            except:
                questions = Question.objects.all()
        serializer_name = questionanswerserializer(questions, many=True)
        serializer = QuestionAnswerSerializer(questions, many=True)
        return Response({"status": "success", 'name': serializer_name.data, 'data': serializer.data})

    def post(self, request):
        serializer = QuestionAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class QuestionEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionAnswerSerializer
    permission_classes = [AllowAny]
    queryset = Question.objects.all()

    def retrieve(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionAnswerSerializer(question)
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_200_OK)
        except:
            return Response({'status': 'failure', "data": "Question doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)


class QuestionList(APIView):
    serializer_class = QuestionGetSerializer
    permission_classes=[AllowAny]

    def post(self,request):
        type = str(self.request.query_params.get('type'))
        grade = request.data.get('grade')
        subject=(request.data.get('subject'))
        from_chapter=(request.data.get('from_chapter'))
        to_chapter = (request.data.get('to_chapter'))
        all_chapters = request.data.get('all_chapters')
        timing = request.data.get('timing')
        overall_marks = request.data.get('overall_marks')
        number_of_questions = int(request.data.get('number_of_questions'))
        print(timing,overall_marks)
        customize = request.data.get('customize')
        if from_chapter != '' and from_chapter is not None:
            from_chapter = int(from_chapter)
        if to_chapter != '' and to_chapter is not None:
            to_chapter = int(to_chapter)
        
        if timing:
            timing= int(timing)
        if overall_marks:
            overall_marks = int(overall_marks)
        try:
            grade = Grade.objects.get(grade=grade)
            subject_obj = Subject.objects.get(id=subject)
            questions=[]
            # customize
            if customize != 'null' or not customize:
                print('hi')
                customize = json.loads(customize)
                for i in customize:
                    chapter = Chapter.objects.get(id=i['id'])
                    for j in i['cognitive_level']:
                        try:
                            cognitive = j.capitalize()
                            newlist = Question.objects.filter(chapter=chapter.id,cognitive_level=cognitive)
                            newlist =(sorted(newlist,key=lambda x: random.random()))
                            num = int(i['cognitive_level'][j])
                            if len(newlist) >= num:
                                newlist = newlist[:num]
                                questions.append(newlist)
                            else:
                                return Response({'status':'failure','data':('Required questions not available in {} level in chapter {}. Available number of questions is {}').format(cognitive,chapter,len(newlist))},status=HTTP_206_PARTIAL_CONTENT)
                        except:
                            return Response({"status": "failure","data":"given details are incorrect"},status=HTTP_206_PARTIAL_CONTENT)
                questions = [item for sublist in questions for item in sublist]
            # without customize
            else:
                if all_chapters:
                    questions = Question.objects.filter(subject=subject_obj)
                else:
                    if from_chapter and to_chapter:
                        from_chapter = Chapter.objects.get(id=from_chapter)
                        to_chapter = Chapter.objects.get(id=to_chapter)
                        print(subject_obj,from_chapter,to_chapter)
                        questions = Question.objects.filter(subject=subject_obj,chapter_no__gte=from_chapter.chapter_no,chapter_no__lte=to_chapter.chapter_no)
                        print(questions)
                    elif from_chapter and not to_chapter:
                        from_chapter = Chapter.objects.get(id=from_chapter)
                        questions = Question.objects.filter(subject=subject_obj,chapter_no__gte=from_chapter.chapter_no)
                    elif to_chapter and not from_chapter:
                        to_chapter = Chapter.objects.get(id=to_chapter)
                        questions = Question.objects.filter(subject=subject_obj,chapter_no__lte=to_chapter.chapter_no)
                    else:
                        questions =  Question.objects.filter(subject=subject_obj)
            print(questions)
            total_questions = len(questions)
            print(total_questions)
            questions =(sorted(questions,key=lambda x: random.random()))
            if number_of_questions <= total_questions:
                questions = questions[:number_of_questions]
            else:
                return Response({'status':'failure','data':f'given number questions is higher then the actual number of questions${total_questions}'},status=HTTP_206_PARTIAL_CONTENT)
            user = self.request.user
            serializer = QuestionSerializer(questions,many=True)
            type = type.lower()
            # answers 
            answers = []
            for question in questions:
                ans = getattr(question.answers,str(question.answers))
                answers.append(ans)
            context = {'data':serializer.data,'grade':grade.grade,'subject':subject_obj.name,'register_number':user.register_number}
            context1 = {'data':serializer.data,'grade':grade.grade,'subject':subject_obj.name,'register_number':user.register_number,'answers':answers}
            answer_file,status =  render_to_pdf2('academics/answer_file.html','answer_files',None,context1)
            # save question_paper in data_base
            if type == 'save':
                cal_timing= 0
                cal_overall_marks = 0
                for i in questions:
                    print(int(i.duration))
                    cal_timing += int(i.duration)
                    cal_overall_marks += int(i.mark)
                if not timing:
                    timing = cal_timing
                if not overall_marks:
                    overall_marks = cal_overall_marks
                created_by = self.request.user.email
                question_paper = Question_Paper.objects.create(grade=grade,subject=subject_obj,created_by=created_by,timing=timing,overall_marks=overall_marks)
                print(question_paper)
                for question in questions:
                    question_paper.no_of_questions.append(question.id)
                question_paper,status = render_to_pdf2('academics/question.html','question_files',question_paper,context)
                if not status:
                    return Response({"status": "failure","data":"given details are incorrect"},status=HTTP_206_PARTIAL_CONTENT) 
                serializer = QuestionPaperSerializer(question_paper)
                return Response({'status':'success','data':serializer.data,'answer-file-path':'/media/answer_files/{answer_file}.pdf','subject_id':subject_obj.id,'grade_id':grade.id},status=HTTP_200_OK)
            filename,status = render_to_pdf2('academics/question.html','question_paper',None,context)
            if not status:
                return Response({"status": "failure","data":"given details are incorrect"},status=HTTP_206_PARTIAL_CONTENT) 
            return Response({'status':'success','question_path':f'/media/question_paper/{filename}.pdf','answer_path':f'/media/answer_files/{answer_file}.pdf','subject_id':subject_obj.id,'grade_id':grade.id})
        except:
            return Response({"status": "failure","data":"given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)


class QuestionPaperList(ListAPIView):
    serializer_class = QuestionPaperSerializer
    permission_classes = [AllowAny]
    queryset = Question_Paper.objects.all().order_by('grade', 'subject')

    def get(self, request):

        grade = (self.request.query_params.get('grade'))
        subject = (str(self.request.query_params.get('subject'))).upper()
        if grade:
            grade = Grade.objects.get(grade=grade)
            try:
                subject = Subject.objects.get(grade=grade.id, name=subject)
                questions = Question_Paper.objects.filter(
                    grade=grade.id, subject=subject.id)
            except:
                questions = Question_Paper.objects.filter(grade=grade.id)
        else:
            questions = Question_Paper.objects.all()

        serializer = QuestionPaperSerializer(questions, many=True)
        return Response({'status': 'success', "data": serializer.data}, status=HTTP_200_OK)


class QuestionPaperView(RetrieveUpdateDestroyAPIView):
    serializer_class= QuestionPaperSerializer
    permission_classes=[AllowAny]
    queryset=Question_Paper.objects.all()

    def retrieve(self,request,pk):
        try:
            question_paper = Question_Paper.objects.get(pk=pk)
            serializer = QuestionPaperSerializer(question_paper)
            type = (self.request.query_params.get('type'))
            if type!=None and (type).lower() == 'file':
                answers_list = []
                questions = question_paper.no_of_questions
                for question in questions:
                    question_from_model = Question.objects.get(id=question)
                    answers = Answers.objects.get(question=question_from_model)
                    answer = answers.answer
                    if answers.question.question_type == 'Fill_in_the_blanks':
                        answer = getattr(answers,str(answer))
                    answers_list.append(answer)
                user = self.request.user
                context = {'answers':answers_list,'grade':question_paper.grade.grade,'subject':question_paper.subject.name,'register_number':user.register_number}
                filename,status = render_to_pdf2('academics/answer_file.html','answer_files',None,context)
                if not status:
                    return Response({'status':'given details incorrect'},status=HTTP_200_OK) 
                return Response({'path':f'/media/answer_files/{filename}.pdf','data': serializer.data},status=HTTP_200_OK)
            return Response({'status':'success','data':serializer.data},status=HTTP_200_OK)
        except:
            return Response({"status": "failure","data":"Question-paper doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)

    def patch(self,request,pk):
        question_paper = Question_Paper.objects.get(pk=pk)
        serializer = QuestionPaperSerializer(question_paper,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


# def frquestion(request):
#     questionform = Questionform
#     answerform = Answerform
#     questions = Question.objects.all()
#     context = {'questionform':questionform,'answerform':answerform,'questions':questions}
#     return render(request,'academics/questionanswer.html',context)


# def get_name(request):
#     id = request.GET.get('id',None)
#     model = request.GET.get('model',None)

#     if id and model:
#         model = model.capitalize()

#         return render(request, 'academics/dropdown_list_options.html', {'items': subject})
#     chapter = Chapter.objects.filter(subject=subject_id)
#     return render(request, 'academics/dropdown_list_options.html', {'items': chapter})


def load_subject_chapter(request):
    grade_id = request.GET.get('grade', None)
    subject_id = request.GET.get('subject', None)
    if grade_id:
        subject = Subject.objects.filter(grade=grade_id).order_by('name')
        return render(request, 'academics/dropdown_list_options.html', {'items': subject})
    chapter = Chapter.objects.filter(subject=subject_id)
    return render(request, 'academics/dropdown_list_options.html', {'items': chapter})



def load_grade(request):
    user = request.user
    print(user)
    if user.user_type == 'is_admin':
        grades = Grade.objects.all()
    elif user.user_type == 'is_staff':
        standard = user.profile.standard
        grades = Grade.objects.filter(grade=standard)
    else:
        return None
    return render(request, 'academics/dropdown_grade.html', {'items':grades})


# def chapterlistview(request):

#     form= Chapterform()
#     return render(request,'academics/chapters.html',{'form':form})

# def subjectlistview(request):

#     form= Subjectform()
#     return render(request,'academics/subjects.html',{'form':form})


# def questionview(request):
#     questionform = Questionform()
#     answerform = Answerform()

#     return render(request,'academics/questionandanswers.html',{'answerform':answerform,'questionform':questionform})

# def question_paperview(request):
#     return render(request,'academics/question_paper.html')


class QuestionFromQuestionPaper(APIView):
    serializer_class = QuestionAnswerSerializer
    queryset = Question.objects.all().order_by('grade', 'subject', 'chapter')
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        question_paper_id = (self.request.query_params.get('question_paper'))
        question_paper = Question_Paper.objects.get(id=question_paper_id)
        question_list = question_paper.no_of_questions
        data = []
        for i in question_list:
            queryset = Question.objects.get(id=int(i))
            data.append((QuestionAnswerSerializer(queryset)).data)
        return Response(data)


class TestCreateView(CreateAPIView):
    serializer_class = TestSerializer
    queryset = Test.objects.all().order_by('grade', 'subject')
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        grade = (self.request.query_params.get('grade'))
        test_id = (self.request.query_params.get('test_id'))
        if grade:
            queryset = Test.objects.filter(grade=grade)
            serializer = TestSerializer(queryset, many=True)
        elif test_id:
            try:
                queryset = Test.objects.get(test_id=test_id)
                serializer = TestSerializer(queryset)
            except:
                return Response({"status": "failure", "data":"please give a valid test id"}, status=HTTP_206_PARTIAL_CONTENT)
         
        else:
            queryset = Test.objects.all().order_by('grade', 'subject')
            serializer = TestSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = TestSerializer(data=request.data)
        if serializer.is_valid():
            question_paper = request.data['question_paper']
            serializer.save()
            Test_obj = Test.objects.get(question_paper=question_paper)
            question_paper = Question_Paper.objects.get(id=question_paper)
            question_paper.test_id = Test_obj.test_id
            question_paper.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class TestEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = TestSerializer
    permission_classes = [AllowAny]
    queryset = Test.objects.all().order_by('grade', 'subject')

    def retrieve(self, request, pk):
        try:
            queryset = Test.objects.get(pk=pk)
        except:
            return Response({'status': 'failure', "data": "Test doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = TestSerializer(queryset)
        return Response(serializer.data, status=HTTP_200_OK)

    def update(self, request, pk):
        test = Test.objects.get(pk=pk)
        serializer = TestSerializer(test, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class TestResultCreateView(CreateAPIView):

    serializer_class = TestResultSerializer
    queryset = TestResult.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        queryset = TestResult.objects.all()
        grade = (self.request.query_params.get('grade'))
        student = self.request.query_params.get('student_id')
        if grade: 
            if student:
                try:
                    grade = Grade.objects.get(grade=grade)
                    queryset = TestResult.objects.filter(grade=grade,student_id=student)
                except:
                    queryset = TestResult.objects.all()
        else:
            try: 
                grade = Grade.objects.get(grade=grade)   
                queryset = TestResult.objects.filter(grade=grade)
            except:
                queryset = TestResult.objects.all()
        queryset = queryset.order_by('grade', 'subject')
        serializer = TestResultSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = TestResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class TestResultEditView(RetrieveDestroyAPIView):
    serializer_class = TestResultSerializer
    permission_classes = [AllowAny]
    queryset = TestResult.objects.all()

    def retrieve(self, request, pk):
        try:
            queryset = TestResult.objects.get(pk=pk)
        except:
            return Response({'status': 'failure', "data": "Test result doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = TestResultSerializer(queryset)
        return Response(serializer.data, status=HTTP_200_OK)

    # def update(self,request,pk):
    #     test = TestResult.objects.get(pk=pk)
    #     serializer = TestResultSerializer(test,data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
    #     return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


class TestInstructionView(ListCreateAPIView):
    serializer_class = TestInstruction
    queryset = InstructionForTest.objects.all()
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = InstructionForTest.objects.all()
        serializer = TestInstruction(queryset, many=True)
        return Response({"status": "success", 'data': serializer.data})

    def create(self, request):
        serializer = TestInstruction(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", 'data': serializer.data}, status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors}, status=HTTP_206_PARTIAL_CONTENT)


class EditTestInstructionView(RetrieveDestroyAPIView):
    serializer_class = TestInstruction
    queryset = InstructionForTest.objects.all()
    permission_classes = [AllowAny]

    def retrieve(self, request, pk):
        try:
            queryset = InstructionForTest.objects.get(id=pk)
        except:
            return Response({'status': 'failure', "data": "Instruction doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = TestInstruction(queryset)
        return Response(serializer.data, status=HTTP_200_OK)


def update(request):
    data = Question.objects.all()
    for i in data:
        chapter = Chapter.objects.get(id=i.chapter_id)
        print(chapter)
        i.chapter_no = chapter.chapter_no
        i.save()
