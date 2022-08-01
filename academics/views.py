from ast import List
from operator import truediv
from os import stat
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
    ListAPIView,
    )
from accounts.permission import IsAdminUser, IsStaffUser
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,HTTP_404_NOT_FOUND,HTTP_401_UNAUTHORIZED,HTTP_206_PARTIAL_CONTENT,
    HTTP_400_BAD_REQUEST,HTTP_201_CREATED,HTTP_203_NON_AUTHORITATIVE_INFORMATION,HTTP_204_NO_CONTENT,HTTP_422_UNPROCESSABLE_ENTITY
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
    )
from .models import Question, Subject,Grade,Chapter,Question_Paper,Answers
from accounts.models import User
from .utils import render_to_pdf, render_to_pdf2

# Create your views here.


class GradeView(ListCreateAPIView):
    serializer_class = GradeSerializer
    queryset = Grade.objects.all().order_by('grade')
    permission_classes = [AllowAny]

    def list(self,request):
        queryset = self.get_queryset()
        serializer = GradeSerializer(queryset,many=True)
        return Response({"status": "success",'data':serializer.data})

    def create(self,request):
        serializer = GradeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)

class GradeEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = GradeSerializer
    permission_classes = [AllowAny]
    queryset = Grade.objects.all().order_by('grade')

    def retrieve(self, request,pk):
        try:
            queryset = Grade.objects.get(pk=pk)
        except:
            return Response({'status':'failure',"data": "Grade doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = GradeSerializer(queryset)
        return Response(serializer.data,status=HTTP_200_OK)
    
    def update(self,request,pk):
        subject = Subject.objects.get(pk=pk)
        serializer = SubjectSerializer(subject,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


class SubjectCreateView(ListCreateAPIView):
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all().order_by('grade','code')
    permission_classes = [AllowAny]

    def list(self,request):
        queryset = self.get_queryset()
        serializer = SubjectSerializer(queryset,many=True)
        return Response(serializer.data)

    def create(self,request):
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
                recipient_list = [admin.email,]
                send_mail(subject,message,email_from,recipient_list)
            
            return Response({"status": "success",'data':serializer.data},status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


class SubjectEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]
    queryset = Subject.objects.all().order_by('grade','code')

    def retrieve(self, request,pk):
        try:
            queryset = Subject.objects.get(pk=pk)
        except:
            return Response({'status':'failure',"data": "Subject doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = SubjectSerializer(queryset)
        return Response(serializer.data,status=HTTP_200_OK)
    
    def update(self,request,pk):
        subject = Subject.objects.get(pk=pk)
        serializer = SubjectSerializer(subject,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


class ChaptersCreateView(CreateAPIView):

    serializer_class=ChapterSerializer
    queryset= Chapter.objects.all().order_by('subject','chapter_no')
    permission_classes=[AllowAny]

    def get(self, request, format=None):
        queryset= Chapter.objects.all().order_by('subject','chapter_no')
        serializer = ChapterSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ChapterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_201_CREATED)   
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)


class ChapterEditView(RetrieveUpdateDestroyAPIView):

    serializer_class=ChapterSerializer
    permission_classes=[AllowAny]
    queryset = Chapter.objects.all().order_by('subject','chapter_no')

    def retrive(self,request,pk):
        try:
            queryset = Chapter.objects.get(pk=pk)
        except:
            return Response({'status':'failure',"data": "Chapter doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = ChapterSerializer(queryset)
        return Response(serializer.data)

    def update(self,request,pk):
        subject = Chapter.objects.get(pk=pk)
        serializer = ChapterSerializer(subject,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)   
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)
        

# class ChapterListView(APIView):
#     serializer_class=ChapterViewSerializer
#     permission_classes=[AllowAny]

#     def post(self,request):
#         grade = request.data.get('grade')
#         subject=(request.data.get('subject')).upper()
#         try:
#             if subject:
#                 data = []
#                 grade = Grade.objects.get(grade=grade)
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
    serializer_class=ChapterViewSerializer
    permission_classes=[AllowAny]
    def post(self,request):
        grade = request.data.get('grade')
        subject=(request.data.get('subject')).upper()
        try:
            if subject:
                data = []
                grade = Grade.objects.get(grade=grade)
                subject = Subject.objects.get(name=subject,grade=grade.grade)
                chapters = (Chapter.objects.filter(subject=subject)).order_by('subject','chapter_no')
                for object in chapters:
                    data.insert(0,{
                    "id" : object.id,
                    "subject" : subject.name,
                    "subject_id" : subject.id,
                    "grade" :subject.grade.grade,
                    "name": object.name,
                    "chapter_no": object.chapter_no,
                    "description": object.description,
                    })
                return Response({"status": "success",'data':data})
        except:
            return Response({"status": "Not found"}, status=HTTP_206_PARTIAL_CONTENT)
        return Response({"status": "failed"}, status=HTTP_206_PARTIAL_CONTENT)



class SubjectListView(ListAPIView):
    serializer_class=SubjectSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        queryset = Subject.objects.all()
        grade = self.request.query_params.get('grade')
        if grade is not None:
            try:
                grades = Grade.objects.get(grade=grade)
                queryset = (queryset.filter(grade=grades.id).order_by('grade','code','name'))
            except :
                return Response({'status':'failed'},status=HTTP_206_PARTIAL_CONTENT)
            return queryset

    def list(self,request):
        queryset = self.get_queryset()
        serializer = SubjectSerializer(queryset,many=True)
        return Response(serializer.data)


class QuestionCreateView(CreateAPIView):
    serializer_class= QuestionAnswerSerializer
    queryset = Question.objects.all().order_by('grade','subject','chapter')
    permission_classes=[AllowAny]

    def get(self, request):
        questions = Question.objects.all()
        serializer_name =questionanswerserializer(questions,many=True)
        serializer = QuestionAnswerSerializer(questions,many=True)
        return Response({"status": "success",'name':serializer_name.data,'data':serializer.data})

    def post(self, request):
        serializer = QuestionAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)

class QuestionEditView(RetrieveUpdateDestroyAPIView):
    serializer_class= QuestionAnswerSerializer
    permission_classes=[AllowAny]
    queryset=Question.objects.all()

    def retrieve(self,request,pk):
        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionAnswerSerializer(question)
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
        except:
            return Response({'status':'failure',"data": "Question doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)

class QuestionList(APIView):
    serializer_class = QuestionGetSerializer
    permission_classes=[IsAdminUser]

    def post(self,request):
        type = str(self.request.query_params.get('type'))
        grade = request.data.get('grade')
        subject=(request.data.get('subject')).upper()
        number_of_questions = int(request.data.get('number_of_questions'))
        try:
            grade = Grade.objects.get(grade=grade)
            subject = Subject.objects.get(name=subject,grade=grade.id)
            questions = Question.objects.filter(grade=grade.id,subject=subject.id)

            total_questions = questions.count()
            questions =(sorted(questions,key=lambda x: random.random()))

            if number_of_questions <= total_questions:
                questions = questions[:number_of_questions]
            else:
                return Response({'status':'failure','data':'given number questions is higher then the actual number of questions '},status=HTTP_206_PARTIAL_CONTENT)
            user = self.request.user
            serializer = QuestionSerializer(questions,many=True)
            type = type.lower()
            answers = []
            for question in questions:
                ans = getattr(question.answers,str(question.answers))
                answers.append(ans)
            context = {'data':serializer.data,'grade':grade.grade,'subject':subject.name,'register_number':user.register_number}
            context1 = {'data':serializer.data,'grade':grade.grade,'subject':subject.name,'register_number':user.register_number,'answers':answers}
            answer_file,status =  render_to_pdf2('academics/answer_file.html','answer_files',None,context1)
            if type == 'save':
                created_by = self.request.user.email
                question_paper = Question_Paper.objects.create(grade=grade,subject=subject,created_by=created_by)
                for question in questions:
                    question_paper.no_of_questions.append(question.id)
                question_paper,status = render_to_pdf2('academics/question.html','question_files',question_paper,context)
                if not status:
                    return Response({"status": "failure","data":"given details are incorrect"},status=HTTP_206_PARTIAL_CONTENT) 
                serializer = QuestionPaperSerializer(question_paper)
                return Response({'status':'success','data':serializer.data,'answer-file-path':'/media/answer_files/{answer_file}.pdf','subject_id':subject.id,'grade_id':grade.id},status=HTTP_200_OK)

            filename,status = render_to_pdf2('academics/question.html','question_paper',None,context)
            if not status:
                return Response({"status": "failure","data":"given details are incorrect"},status=HTTP_206_PARTIAL_CONTENT) 
            return Response({'status':'success','question_path':f'/media/question_paper/{filename}.pdf','answer_path':f'/media/answer_files/{answer_file}.pdf','subject_id':subject.id,'grade_id':grade.id})
        except:
            return Response({"status": "failure","data":"given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)

class QuestionPaperList(ListAPIView):
    serializer_class= QuestionPaperSerializer
    permission_classes=[AllowAny]
    queryset = Question_Paper.objects.all().order_by('grade','subject')

    def get(self, request):
        questions = Question_Paper.objects.all()
        serializer =QuestionPaperSerializer(questions,many=True)
        return Response({'status':'success',"data":serializer.data},status=HTTP_200_OK)


class QuestionPaperView(RetrieveAPIView):
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
    grade_id = request.GET.get('grade',None)
    subject_id = request.GET.get('subject',None)
    if grade_id:
        subject = Subject.objects.filter(grade=grade_id).order_by('name')
        return render(request, 'academics/dropdown_list_options.html', {'items': subject})
    chapter = Chapter.objects.filter(subject=subject_id)
    return render(request, 'academics/dropdown_list_options.html', {'items': chapter})

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


class TestCreateView(CreateAPIView):

    serializer_class= TestSerializer
    queryset= Test.objects.all().order_by('grade','subject')
    permission_classes=[AllowAny]

    def get(self, request, format=None):
        queryset= Test.objects.all().order_by('grade','subject')
        serializer = TestSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = TestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_201_CREATED)   
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)
        
        
class TestEditView(RetrieveUpdateDestroyAPIView):
    serializer_class = TestSerializer
    permission_classes = [AllowAny]
    queryset = Test.objects.all().order_by('grade','subject')

    def retrieve(self, request,pk):
        try:
            queryset = Test.objects.get(pk=pk)
        except:
            return Response({'status':'failure',"data": "Subject doesn't exists"}, status=HTTP_206_PARTIAL_CONTENT)
        serializer = TestSerializer(queryset)
        return Response(serializer.data,status=HTTP_200_OK)
    
    def update(self,request,pk):
        test = Test.objects.get(pk=pk)
        serializer = TestSerializer(test,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success",'data':serializer.data},status=HTTP_200_OK)
        return Response({"status": "failure", "data": serializer.errors},status=HTTP_206_PARTIAL_CONTENT)
 
