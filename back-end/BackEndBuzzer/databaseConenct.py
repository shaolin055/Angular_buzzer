import mysql.connector
import pandas as pd
class Database:
    # def __int__(self):
        # print("we are doomed")
        # self._connection = mysql.connector.connect(user='buzzer_user', password='password',
        #                          host='127.0.0.1',
        #                          database='buzzer')
        # print("we ARE")
    def ReadDatabase(self,query):
        _connection = mysql.connector.connect(user='buzzer_user', password='password',
                                                   host='127.0.0.1',
                                                   database='buzzer')
        cursor = _connection.cursor()
        cursor.execute(query)
        questionBank = {}
        for (Id, question, a , b, c, answer) in cursor:
            questionBank[Id]= [question, a, b, c, answer] # transmitting all question at a time. but need to send one question later.
        cursor.close()
        return questionBank

    def CreateTable(self,createCommand):
        _connection = mysql.connector.connect(user='buzzer_user', password='password',
                                              host='127.0.0.1',
                                              database='buzzer')

        cursor = _connection.cursor()
        cursor.execute(createCommand)
        _connection.commit()
        cursor.close()
    def ExecuteAndReturn(self,query):
        _connection = mysql.connector.connect(user='buzzer_user', password='password',
                                              host='127.0.0.1',
                                              database='buzzer')
        cursor = _connection.cursor()
        cursor.execute(query)
        # _connection.commit()
        dataFromTable = []
        for item in cursor:
            # print(item)
            dataFromTable.append(item) # transmitting all question at a time. but need to send one question later.
        cursor.close()
        return dataFromTable

# a =  Database()
#
#
# b = a.readDatabase("SELECT * from QuestionBank;");
# print(b)