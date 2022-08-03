
import time
import serial
import mysql.connector
arduino = serial.Serial(
        port='/dev/ttyACM0',
        baudrate = 9600,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
)
print("Conectado por serial..")
arduino.flush()
temperatura=0
try:
    while(1):
        try:
            if(arduino.in_waiting>0):
                temperatura=arduino.readline().decode('utf-8').rstrip()
                print(temperatura)
            connection = mysql.connector.connect(host='192.168.1.102',
                                                 port=3306,
                                                 user='gustavocastillo',
                                                 database='telemetry',
                                                 password='mqtt96')
            mySql_insert_query = """INSERT INTO Temperatura (temperatura,fecha) 
                                   VALUES 
                                   ("""+str(temperatura)+""", now()) """
            cursor = connection.cursor()
            cursor.execute(mySql_insert_query)
            connection.commit()
            print(cursor.rowcount, "Record inserted successfully into temp")
            cursor.close()
        except mysql.connector.Error as error:
            print("Failed to insert record into Laptop table {}".format(error))
        time.sleep(10);
except(KeyboardInterrup,SystemExit):
    print("bye");
    
