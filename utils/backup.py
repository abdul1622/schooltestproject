# class QuestionList2(APIView):
#     serializer_class = QuestionGetSerializer
#     permission_classes = [AllowAny]

#     def post(self, request):
#         type = str(self.request.query_params.get('type'))
#         grade = request.data.get('grade')
#         subject = (request.data.get('subject'))
#         from_chapter = (request.data.get('from_chapter'))
#         to_chapter = (request.data.get('to_chapter'))
#         all_chapters = request.data.get('all_chapters')
#         timing = request.data.get('timing')
#         overall_marks = request.data.get('overall_marks')
#         number_of_questions = int(request.data.get('number_of_questions'))
#         print(timing, overall_marks)
#         customize = request.data.get('customize')
#         if from_chapter != '' and from_chapter is not None:
#             from_chapter = int(from_chapter)
#         if to_chapter != '' and to_chapter is not None:
#             to_chapter = int(to_chapter)

#         if timing:
#             timing = int(timing)
#         if overall_marks:
#             overall_marks = int(overall_marks)
#         try:
#             grade = Grade.objects.get(grade=grade)
#             subject_obj = Subject.objects.get(id=subject)
#             questions = []
#             # customize
#             if customize != 'null' or not customize:
#                 print('hi')
#                 customize = json.loads(customize)
#                 for i in customize:
#                     chapter = Chapter.objects.get(id=i['id'])
#                     for j in i['cognitive_level']:
#                         try:
#                             cognitive = j.capitalize()
#                             newlist = Question.objects.filter(
#                                 chapter=chapter.id, cognitive_level=cognitive)
#                             newlist = (
#                                 sorted(newlist, key=lambda x: random.random()))
#                             num = int(i['cognitive_level'][j])
#                             if len(newlist) >= num:
#                                 newlist = newlist[:num]
#                                 questions.append(newlist)
#                             else:
#                                 return Response({'status': 'failure', 'data': ('Required questions not available in {} level in chapter {}. Available number of questions is {}').format(cognitive, chapter, len(newlist))}, status=HTTP_206_PARTIAL_CONTENT)
#                         except:
#                             return Response({"status": "failure", "data": "given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)
#                 questions = [item for sublist in questions for item in sublist]
#             # without customize
#             else:
#                 if all_chapters:
#                     questions = Question.objects.filter(subject=subject_obj)
#                 else:
#                     if from_chapter and to_chapter:
#                         from_chapter = Chapter.objects.get(id=from_chapter)
#                         to_chapter = Chapter.objects.get(id=to_chapter)
#                         print(subject_obj, from_chapter, to_chapter)
#                         questions = Question.objects.filter(
#                             subject=subject_obj, chapter_no__gte=from_chapter.chapter_no, chapter_no__lte=to_chapter.chapter_no)
#                         print(questions)
#                     elif from_chapter and not to_chapter:
#                         from_chapter = Chapter.objects.get(id=from_chapter)
#                         questions = Question.objects.filter(
#                             subject=subject_obj, chapter_no__gte=from_chapter.chapter_no)
#                     elif to_chapter and not from_chapter:
#                         to_chapter = Chapter.objects.get(id=to_chapter)
#                         questions = Question.objects.filter(
#                             subject=subject_obj, chapter_no__lte=to_chapter.chapter_no)
#                     else:
#                         questions = Question.objects.filter(
#                             subject=subject_obj)
#             print(questions)
#             total_questions = len(questions)
#             print(total_questions)
#             questions = (sorted(questions, key=lambda x: random.random()))
#             if number_of_questions <= total_questions:
#                 questions = questions[:number_of_questions]
#             else:
#                 return Response({'status': 'failure', 'data': f'given number questions is higher then the actual number of questions${total_questions}'}, status=HTTP_206_PARTIAL_CONTENT)
#             user = self.request.user
#             serializer = QuestionSerializer(questions, many=True)
#             type = type.lower()
#             # answers
#             answers = []
#             for question in questions:
#                 ans = getattr(question.answers, str(question.answers))
#                 answers.append(ans)
#             context = {'data': serializer.data, 'grade': grade.grade,
#                        'subject': subject_obj.name, 'register_number': user.register_number}
#             context1 = {'data': serializer.data, 'grade': grade.grade, 'subject': subject_obj.name,
#                         'register_number': user.register_number, 'answers': answers}
#             answer_file, status = render_to_pdf2(
#                 'academics/answer_file.html', 'answer_files', None, context1)
#             # save question_paper in data_base
#             if type == 'save':
#                 cal_timing = 0
#                 cal_overall_marks = 0
#                 for i in questions:
#                     print(int(i.duration))
#                     cal_timing += int(i.duration)
#                     cal_overall_marks += int(i.mark)
#                 if not timing:
#                     timing = cal_timing
#                 if not overall_marks:
#                     overall_marks = cal_overall_marks
#                 created_by = self.request.user.email
#                 question_paper = Question_Paper.objects.create(
#                     grade=grade, subject=subject_obj, created_by=created_by, timing=timing, overall_marks=overall_marks)
#                 print(question_paper)
#                 for question in questions:
#                     question_paper.no_of_questions.append(question.id)
#                 question_paper, status = render_to_pdf2(
#                     'academics/question.html', 'question_files', question_paper, context)
#                 if not status:
#                     return Response({"status": "failure", "data": "given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)
#                 serializer = QuestionPaperSerializer(question_paper)
#                 return Response({'status': 'success', 'data': serializer.data, 'answer-file-path': '/media/answer_files/{answer_file}.pdf', 'subject_id': subject_obj.id, 'grade_id': grade.id}, status=HTTP_200_OK)
#             filename, status = render_to_pdf2(
#                 'academics/question.html', 'question_paper', None, context)
#             if not status:
#                 return Response({"status": "failure", "data": "given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)
#             return Response({'status': 'success', 'question_path': f'/media/question_paper/{filename}.pdf', 'answer_path': f'/media/answer_files/{answer_file}.pdf', 'subject_id': subject_obj.id, 'grade_id': grade.id})
#         except:
#             return Response({"status": "failure", "data": "given details are incorrect"}, status=HTTP_206_PARTIAL_CONTENT)
