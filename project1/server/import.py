import os;
import csv;

try:
    import psycopg2
except ImportError:
    os.system('pip3 install psycopg2-binary')
    import psycopg2

DATABASE_URL = "postgres://exjjkzmxbgaznj:a055be0c06169b7760b425694134f75318ff7750a3089b6ca686421e30ce7ca9@ec2-79-125-4-72.eu-west-1.compute.amazonaws.com:5432/d746m01p7ppuvo"
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cur = conn.cursor()
with open('books.csv') as csvfile:
        readCSV = csv.reader(csvfile)
        for rows in readCSV:
            if rows[0] != "isbn":
                res = cur.execute("insert into books values('" + str(rows[0]) + "','" + str(rows[1]).replace("'","\"") + "','" + str(rows[2]).replace("'","\"") + "'," + rows[3] + ");")
                print(res)

print("inserted")