#
# -*- encoding: utf-8 -*-

import sys
from os import path, environ
environ['JDK_HOME'] = "C:\\Program Files\\Java\\jdk1.8.0_191"
environ['JAVA_HOME'] = "C:\\Program Files\\Java\\jdk1.8.0_191"
environ['PATH'] += ';C:\\Program Files\\Java\\jdk1.8.0_191\\jre\\bin\\server\\;C:\\Program Files\\Java\\jdk1.8.0_191\\bin\\;C:\\Users\\carlo\\Projects\\CabadaOWASP\\server\\scripts\\java\\RC6.jar'
environ['CLASSPATH'] = "C:\\Users\\carlo\\Projects\\CabadaOWASP\\server\\scripts\\java\\RC6.jar"

# print(path.abspath("java\\RC6.jar"))

from jnius import autoclass

Control = autoclass('rc6.Control')
ctrl = Control()
ctrl.cifrar(str(sys.argv[3:4][0]) + "", "123456789abcdefg")
cjava = ctrl.getTcifra()
# cifrado = autoclass('java.lang.System').out.println(cjava)
# print(cifrado)

ctrl.descifrar("123456789abcdefg")
djava = ctrl.getTdesci()
# descifrado = autoclass('java.lang.System').out.println(djava)
# print(descifrado)



if sys.argv[1:2][0] == 'encrypt':
    print({
        'mode': sys.argv[1:2][0],
        'key': sys.argv[2:3][0],
        'msg': sys.argv[3:4][0],
        'result': djava
    })
else:
    print({
        'mode': sys.argv[1:2][0],
        'key': sys.argv[2:3][0],
        'msg': sys.argv[3:4][0],
        'result': djava
    })