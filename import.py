import os;
import csv;

try:
    import psycopg2
except ImportError:
    os.system('pip3 install psycopg2-binary')
    import psycopg2

DATABASE_URL = "postgres://kvodqjxngtsgpt:3f8bc0ed76c932265edff00946122e5386ad95fc7553ba5a7cdeb19c453a65da@ec2-54-246-92-116.eu-west-1.compute.amazonaws.com:5432/d2e8i4j1a7bhqu"
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cur = conn.cursor()
count=0
with open('books.csv') as csvfile:
        readCSV = csv.reader(csvfile)
        for rows in readCSV:
            if rows[0] != "isbn":
                res = cur.execute("insert into books (isbn,author,title,year)values('" + str(rows[0]) + "','" + str(rows[1]).replace("'","\"") + "','" + str(rows[2]).replace("'","\"") + "'," + rows[3] + ");")
                print(res)
                count+=1
                print(count)
                conn.commit()
print("inserted")