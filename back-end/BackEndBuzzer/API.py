import random

from flask import Flask , request
from databaseConenct import Database

#import pandas as pd

#https://www.youtube.com/watch?v=s_ht4AKnWZg&ab_channel=MelvinL

from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app, support_credentials = True)
api = Api(app)

# @cross_origin(supports_credentials=True)

class GetQuestion(Resource):
    def get(self):
        database = Database()
        data = database.ReadDatabase('SELECT * from QuestionBank;')
        # data = {"a": "sfls", "b": "sdfa"}
        return {'data':data}, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user', type = str)
        parser.add_argument('answer',type = str)
        args = parser.parse_args()
        return {
            'loc':args['user'],
            'answer': args['answer']
        }, 200


class Create_palying_table(Resource):
    def get(self):
        try:
            #test table : ad_3576968_question
            ## create database table containing question for the game
            user = request.args.getlist('user')[0]
            # user = 'shaolin'
            table_tag= str(random.randrange(1000,20000000,8))
            table_name = user+"_"+table_tag+"_question"
            database = Database()
            database.CreateTable("use buzzer;")
            createTableQuery = """ CREATE TABLE """+table_name+"""(
            QuestionID int NOT NULL,
            Question varchar(255),
            a varchar(255),
            b varchar(255),
            c varchar(255),
            RightAnswer varchar(255),
            IsRead int DEFAULT 0,
            WhoAnswered varchar(255) DEFAULT ""
            );"""
            # print(createTableQuery)
            database.CreateTable(createTableQuery)

            ## Read and insert data into question table

            database = Database()
            dataFromQuestionBank = database.ReadDatabase("select * from questionbank;")
            print(dataFromQuestionBank)
            # table_name = user+"_"+"3576968"+"_question"
            for i in dataFromQuestionBank:
                print(dataFromQuestionBank[i][0],dataFromQuestionBank[i][1],dataFromQuestionBank[i][2], dataFromQuestionBank[i][3], dataFromQuestionBank[i][4])
                dataInsertScoreTable = Database()
                dataInsertQuery = """insert into """+table_name+""" (QuestionID, Question,a,b,c, RightAnswer,IsRead, WhoAnswered) 
                values("""+str(i)+""",'"""+dataFromQuestionBank[i][0]+"""','"""+dataFromQuestionBank[i][1]+"""','"""+dataFromQuestionBank[i][2]+"""','"""+dataFromQuestionBank[i][3]+"""','"""+dataFromQuestionBank[i][4]+"""',0,"");"""
                print(dataInsertQuery)
                dataInsertScoreTable.CreateTable(dataInsertQuery)

            ## create database table containing score for the game
            table_name_for_score = user+"_"+table_tag+"_score"
            database_for_score_table = Database()
            database_for_score_table.CreateTable("use buzzer;")
            createTableQuery = """ CREATE TABLE """+table_name_for_score+"""(
            UserName varchar(255),
            IsHost BIT DEFAULT 0,
            POINT int DEFAULT 0
            );"""
            database_for_score_table.CreateTable(createTableQuery)

            ##Insert host info into score table
            database = Database()
            database.CreateTable("use buzzer;")
            insertQuery = """insert into """ + table_name_for_score + """ (UserName, IsHost, POINT) values('""" + user + """',1,0);"""
            database.CreateTable(insertQuery)

            ## create database table containing score for the game
            LogTable = "LogTable"
            databaseForTableLog = Database()
            databaseForTableLog.CreateTable("use buzzer;")
            insertQuery = "insert into "  + LogTable + " (HostName, TableName) values('" + user + "',"+table_tag+");"
            print(insertQuery)
            databaseForTableLog.CreateTable(insertQuery)
            return table_tag, 200
        except:
            return "",200

class JoinInaExistingTable(Resource):
    def get(self):
        user = request.args.getlist('user')[0]
        hostUser = request.args.getlist('hostUser')[0]
        table_tag = request.args.getlist('table_tag')[0]
        ##check if play table exits.
        table_name_for_score = hostUser +"_"+table_tag+"_score"
        query = "show tables like '"+ table_name_for_score+"';"
        # print(query)
        database = Database()
        responseFromdatabase = database.ExecuteAndReturn(query)
        if(responseFromdatabase):
            checkIfUserExists = "select * from "+table_name_for_score + " where UserName='" +user +"';"
            databaseUserCheckinTable = Database();
            databaseUserCheckinTableResponse = databaseUserCheckinTable.ExecuteAndReturn(checkIfUserExists);
            if ( not databaseUserCheckinTableResponse):
                databaseCreateNewUserEntry = Database();
                databaseCreateNewUserEntry.CreateTable("use buzzer;")
                insertQuery = """insert into """ + table_name_for_score + """ (UserName, IsHost, POINT) values('""" + user + """',0,0);"""
                databaseCreateNewUserEntry.CreateTable(insertQuery)
                return True, 200
            else:
                return False,200

        else:
            print("No response")
            return False ,200

class RequestForQuestion(Resource):
    def get(self):
        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        database = Database()
        table_name_for_question = hostUser + "_" + tableTag + "_question"
        dataFromQuestionBank = database.ExecuteAndReturn("select * from "+table_name_for_question+";")
        nextQuestion= [];
        for iter in dataFromQuestionBank:
            if iter[-2]==0:
                nextQuestion=[iter[0],iter[1], iter[2], iter[3], iter[4]]
                updateQuery = "UPDATE "+table_name_for_question+ " set IsRead = 3 where QuestionID =" + str(iter[0])+ ";"
                print(updateQuery)
                database_update1 = Database()
                database_update1.CreateTable(updateQuery)

                updateQuery = "UPDATE " + table_name_for_question + " set IsRead = 2 where IsRead = 1;"
                database_update2 = Database()
                database_update2.CreateTable(updateQuery)

                updateQuery = "UPDATE " + table_name_for_question + " set IsRead = 1 where IsRead = 3;"
                database_update3 = Database()
                database_update3.CreateTable(updateQuery)

                return nextQuestion, 200

class MakeQuestionasRead(Resource):
    def get(self):
        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        database = Database()
        table_name_for_question = hostUser + "_" + tableTag + "_question"

        updateQuery = "UPDATE "+table_name_for_question+ " set IsRead = 2 where IsRead =1";
        print(updateQuery)
        database_update1 = Database()
        database_update1.CreateTable(updateQuery)

        return True, 200

class FetchQuestionForJoinerFromDatabase(Resource):
    def get(self):
        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        database = Database()
        table_name_for_question = hostUser + "_" + tableTag + "_question"
        dataFromQuestionBank = database.ExecuteAndReturn("select * from "+table_name_for_question+" where IsRead = 1;")
        nextQuestion=[]
        for iter in dataFromQuestionBank:
            nextQuestion=[iter[0],iter[1], iter[2], iter[3], iter[4]]
        return nextQuestion

class CheckRecentQuestionResult(Resource):
    def get(self):
        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        database = Database()
        table_name_for_question = hostUser + "_" + tableTag + "_question"
        selectQuery = "select WhoAnswered from " + table_name_for_question + " where IsRead = 1;"
        print(selectQuery)

        dataFromQuestionBank = database.ExecuteAndReturn(selectQuery)
        return dataFromQuestionBank

class CheckAnswer(Resource):
    def get(self):
        user = request.args.getlist('user')[0]
        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        questionID = request.args.getlist('questionID')[0]
        answer = request.args.getlist('answer')[0]
        database = Database()
        table_name_for_question = hostUser + "_" + tableTag + "_question"
        table_name_for_score = hostUser + "_" + tableTag + "_score"
        selectQuery = "select * from " + table_name_for_question + " where QuestionID = "+questionID+";"
        print(selectQuery)
        dataFromQuestionBank = database.ExecuteAndReturn(selectQuery)
        print(dataFromQuestionBank)
        for iter in dataFromQuestionBank:
            if iter[-1] == "" and iter[-2] == 1 and iter[5] == answer:
                updateQuery = "UPDATE " + table_name_for_question + " set  WhoAnswered = '"+ user+"' where QuestionID =" + questionID + ";"
                print(updateQuery)
                database_update = Database()
                database_update.CreateTable(updateQuery)

                database = Database()
                [(userPointFromDatabase,)] = database.ExecuteAndReturn(
                    "select POINT from " + table_name_for_score + " where UserName  = '" + user + "';")
                # print(userPointFromDatabase)
                userPoint = int(userPointFromDatabase);

                updateScoreTableQuery = "UPDATE " + table_name_for_score + " set  POINT = " + str(userPoint+1) + " where UserName = '" + user + "';"
                print(updateScoreTableQuery)
                database_update = Database()
                database_update.CreateTable(updateScoreTableQuery)
                return True, 200
            else:
                return False, 200

class CheckScore(Resource):
    def get(self):

        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        # print(hostUser, tableTag)
        # tableTag = "3846872"
        table_name_for_score = hostUser + "_" + tableTag + "_score"
        # selectQuery = "select POINT from " + table_name_for_score + " where UserName  = '" + hostUser + "';"
        selectQuery = "select * from " + table_name_for_score +";"
        database = Database()
        pointTable = database.ExecuteAndReturn(selectQuery)
        print(pointTable)
        return pointTable , 200

class RecentScore(Resource):
    def get(self):

        hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        questionID = request.args.getlist('questionID')[0]



        # print(hostUser, tableTag)
        # tableTag = "3846872"
        table_name_for_question = hostUser + "_" + tableTag + "_question"
        selectQuery = "select WhoAnswered from " + table_name_for_question + " where questionID  = '" + questionID + "';"
        database = Database()
        personAnswered = database.ExecuteAndReturn(selectQuery)
        print(personAnswered)
        return personAnswered , 200

class CheckHost(Resource):
    def get(self):
        # hostUser = request.args.getlist('hostUser')[0]
        tableTag = request.args.getlist('tableTag')[0]
        # tableTag = '19034248'
        # print(hostUser, tableTag)
        # tableTag = "3846872"
        tableForTableLog =  "LogTable"
        selectQuery = "select HostName from " + tableForTableLog + " where TableName = " + tableTag + ";"
        database = Database()
        pointTable = database.ExecuteAndReturn(selectQuery)
        print(pointTable)
        return pointTable , 200


# a=Create_palying_table()
# print(a.get())
# a = JoinInaExistingTable()
# print(a.get("islam","shaolin","3846872"))
# print(a.get("ad","3576968"))
# a = RequestForQuestion()
# print(a.get("shaolin","5487384"))
api.add_resource(GetQuestion,'/GetQuestion')
api.add_resource(CheckScore,'/CheckScore')
api.add_resource(CheckRecentQuestionResult,'/CheckRecentQuestionResult')
api.add_resource(CheckAnswer,'/CheckAnswer')
api.add_resource(RequestForQuestion,'/RequestForQuestion')
api.add_resource(FetchQuestionForJoinerFromDatabase,'/FetchQuestionForJoinerFromDatabase')
api.add_resource(JoinInaExistingTable,'/JoinInaExistingTable')
api.add_resource(Create_palying_table,'/CreatePalyingTable')
api.add_resource(CheckHost,'/CheckHost')
# api.add_resource(Location,''/CheckAnswer'o
# a = CheckAnswer()
# print(a.get('islam','shaolin','3846872','3','a'))
# a=CheckScore()
# print(a.get('shaolin','3846872'))
if __name__ == "__main__":
    app.run(debug=True)