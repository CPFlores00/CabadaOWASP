/*
 * RC&.java
 * Creado el 08/05/2019
 * Seguridad informatica MJ 3-4:30pm
 */
package rc6;

/**
 * Esta clase tiene todo el procesamiento logico del funcionamiento del cifrado rc6
 * y todas sus caracterisiticas
 * 
 * @author Andrea Díaz Gutiérrez 
 * @author José Carlos Grandío Robles 
 * @author Jesús Iván González López
 * @author Carlos Raul Flores Carballo
 */
public class RC6 {
    //Atributos estaticas

    private static int w = 32, r = 20;
    private static final double e = Math.E;
    private static final double goldenRatio = 1.6180339887496482;

    private static int Pw = 0xb7e15163, Qw = 0x9e3779b9;

    private static int[] S;

    /**
     * Metodo para convertir bytes palabras
     *
     * @param llave Arreglo de bytes
     * @param c Entero que guarda el valor temporal del arreglo
     * @return Valor temporal de la palabra convertida
     */
    private static int[] convBytesAPalabras(byte[] llave, int u, int c) {
        int[] tmp = new int[c];
        for (int i = 0; i < tmp.length; i++) {
            tmp[i] = 0;
        }

        for (int i = 0, off = 0; i < c; i++) {
            tmp[i] = ((llave[off++] & 0xFF)) | ((llave[off++] & 0xFF) << 8)
                    | ((llave[off++] & 0xFF) << 16) | ((llave[off++] & 0xFF) << 24);
        }

        return tmp;
    }

    /**
     * Metodo para la generacion de las subllaves
     *
     * @param llave Arreglo de bytes
     * @return Regresa el valor de la subllave
     */
    private static int[] generarSubLlaves(byte[] llave) {

        int u = w / 8;
        int c = llave.length / u;
        int t = 2 * r + 4;

        int[] L = convBytesAPalabras(llave, u, c);

        int[] S = new int[t];
        S[0] = Pw;
        for (int i = 1; i < t; i++) {
            S[i] = S[i - 1] + Qw;
        }

        int A = 0;
        int B = 0;
        int k = 0, j = 0;

        int v = 3 * Math.max(c, t);

        for (int i = 0; i < v; i++) {
            A = S[k] = rotarIzquierda((S[k] + A + B), 3);
            B = L[j] = rotarIzquierda(L[j] + A + B, A + B);
            k = (k + 1) % t;
            j = (j + 1) % c;

        }

        return S;
    }

    /**
     * Rotacion de posiciones hacia la izquierda
     */
    private static int rotarIzquierda(int val, int pas) {
        return (val << pas) | (val >>> (32 - pas));
    }
    //Rotacion de posiciones hacia la derecha

    private static int rotarDerecha(int val, int pas) {
        return (val >>> pas) | (val << (32 - pas));
    }

    /**
     * Metodo para decifrar por bloques
     *
     * @param input Arreglo de bytes
     * @return Regresa Valor transformado del arreglo de bytes de manera
     * reversiva
     */
    private static byte[] desencriptarBloque(byte[] input) {
        byte[] tmp = new byte[input.length];
        int t, u;
        int aux;
        int[] data = new int[input.length / 4];
        for (int i = 0; i < data.length; i++) {
            data[i] = 0;
        }
        int off = 0;
        for (int i = 0; i < data.length; i++) {
            data[i] = ((input[off++] & 0xff))
                    | ((input[off++] & 0xff) << 8)
                    | ((input[off++] & 0xff) << 16)
                    | ((input[off++] & 0xff) << 24);
        }

        int A = data[0], B = data[1], C = data[2], D = data[3];

        C = C - S[2 * r + 3];
        A = A - S[2 * r + 2];
        for (int i = r; i >= 1; i--) {
            aux = D;
            D = C;
            C = B;
            B = A;
            A = aux;

            u = rotarIzquierda(D * (2 * D + 1), 5);
            t = rotarIzquierda(B * (2 * B + 1), 5);
            C = rotarDerecha(C - S[2 * i + 1], t) ^ u;
            A = rotarDerecha(A - S[2 * i], u) ^ t;
        }
        D = D - S[1];
        B = B - S[0];

        data[0] = A;
        data[1] = B;
        data[2] = C;
        data[3] = D;

        for (int i = 0; i < tmp.length; i++) {
            tmp[i] = (byte) ((data[i / 4] >>> (i % 4) * 8) & 0xff);
        }

        return tmp;
    }

    /**
     * Encriptacion por bloques mediante las rondas de mezcla
     *
     * @param input Arreglo de byes
     * @return Regresa arreglo de byes mezclado
     */
    private static byte[] encriptarBloque(byte[] input) {

        byte[] tmp = new byte[input.length];
        int t, u;
        int aux;
        int[] data = new int[input.length / 4];
        for (int i = 0; i < data.length; i++) {
            data[i] = 0;
        }
        int off = 0;
        for (int i = 0; i < data.length; i++) {
            data[i] = ((input[off++] & 0xff))
                    | ((input[off++] & 0xff) << 8)
                    | ((input[off++] & 0xff) << 16)
                    | ((input[off++] & 0xff) << 24);
        }

        int A = data[0], B = data[1], C = data[2], D = data[3];

        B = B + S[0];
        D = D + S[1];
        for (int i = 1; i <= r; i++) {
            t = rotarIzquierda(B * (2 * B + 1), 5);
            u = rotarIzquierda(D * (2 * D + 1), 5);
            A = rotarIzquierda(A ^ t, u) + S[2 * i];
            C = rotarIzquierda(C ^ u, t) + S[2 * i + 1];

            aux = A;
            A = B;
            B = C;
            C = D;
            D = aux;
        }
        A = A + S[2 * r + 2];
        C = C + S[2 * r + 3];

        data[0] = A;
        data[1] = B;
        data[2] = C;
        data[3] = D;

        for (int i = 0; i < tmp.length; i++) {
            tmp[i] = (byte) ((data[i / 4] >>> (i % 4) * 8) & 0xff);
        }

        return tmp;
    }

    /**
     * Funcion para rellenar parametro de la llave
     */
    private static byte[] RellenarLlave(byte[] llave) {
        int l = llave.length % 4;
        for (int i = 0; i < l; i++) {
            llave[llave.length + i] = 0;
        }
        return llave;
    }

    /**
     * Medoto de cifrado rc6
     *
     * @param data Valor de la cadena en bytes
     * @param llave Valor de la cadena en bytes, 16,32, 64,128
     * @return Arreglo de bytes cifrado en rc6
     */
    public static byte[] encriptar(byte[] data, byte[] llave) {

        byte[] bloc = new byte[16];
        llave = RellenarLlave(llave);
        S = generarSubLlaves(llave);

        int lenght = 16 - data.length % 16;
        byte[] Rellenar = new byte[lenght];
        Rellenar[0] = (byte) 0x80;

        for (int i = 1; i < lenght; i++) {
            Rellenar[i] = 0;
        }
        int count = 0;
        byte[] tmp = new byte[data.length + lenght];
        //afiseazaMatrice(S);
        int i;
        for (i = 0; i < data.length + lenght; i++) {
            if (i > 0 && i % 16 == 0) {
                bloc = encriptarBloque(bloc);
                System.arraycopy(bloc, 0, tmp, i - 16, bloc.length);
            }

            if (i < data.length) {
                bloc[i % 16] = data[i];
            } else {
                bloc[i % 16] = Rellenar[count];
                count++;
                if (count > lenght - 1) {
                    count = 1;
                }
            }
        }
        bloc = encriptarBloque(bloc);
        System.arraycopy(bloc, 0, tmp, i - 16, bloc.length);
        return tmp;
    }

    /**
     * Medoto de decifrado rc6
     *
     * @param data Valor de la cadena en bytes
     * @param llave Valor de la cadena en bytes, 16,32, 64,128 coincidiente a
     * llave con la que fue cifrada
     * @return Regresa texto decifrado en rc6
     */
    public static byte[] desencriptar(byte[] data, byte[] llave) {
        byte[] tmp = new byte[data.length];
        byte[] bloc = new byte[16];
        llave = RellenarLlave(llave);
        S = generarSubLlaves(llave);

        int i;
        for (i = 0; i < data.length; i++) {
            if (i > 0 && i % 16 == 0) {
                bloc = desencriptarBloque(bloc);
                System.arraycopy(bloc, 0, tmp, i - 16, bloc.length);
            }

            if (i < data.length) {
                bloc[i % 16] = data[i];
            }
        }

        bloc = desencriptarBloque(bloc);
        System.arraycopy(bloc, 0, tmp, i - 16, bloc.length);

        tmp = eliminarRelleno(tmp);
        return tmp;
    }

    /**
     * Metodo de eliminacion de relleno de bytes en la llave
     *
     * @return Arreglo de bytes
     */
    private static byte[] eliminarRelleno(byte[] input) {
        int count = 0;

        int i = input.length - 1;
        while (input[i] == 0) {
            count++;
            i--;
        }

        byte[] tmp = new byte[input.length - count - 1];
        System.arraycopy(input, 0, tmp, 0, tmp.length);
        return tmp;
    }

}
