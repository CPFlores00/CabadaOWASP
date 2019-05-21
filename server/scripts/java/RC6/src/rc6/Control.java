/*
 * Control.java
 * Creado el 5/15/2019
 */
package rc6;

/**
 * Esta clase maneja el control del funcionamiento interno del cifrado
 *
 */
public class Control {

    //Atributos de la clase
    private byte[] enc;
    private byte[] dec;
    private String texto;
    private String key;
    private String tcifra, tdesci;

    /**
     * Constructor por defecto
     */
    public Control(){
        
    }
    
    /**
     * Regresa el texto claro
     *
     * @return Cadena de texto
     */
    public String getTexto() {
        return texto;
    }

    /**
     * Ingresa el texto a establecer
     *
     * @param texto Texto a cifrar
     */
    public void setTexto(String texto) {
        this.texto = texto;
    }

    /**
     * Establece la llave con la que se cifrara el texto
     *
     * @param key Cadena de 16 caracteres. Ej "123456789abcdefg"
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * Metodo para cifrar rc6, recibe como parametro el texto a cifrar y una
     * cadena de 16 caracteres
     *
     * @param texto Cadena de texto a cifrar
     * @param key Cadena llave de 16 caracteres
     */
    public void cifrar(String texto, String key) {
        enc = RC6.encriptar(texto.getBytes(), key.getBytes()); //"123456789abcdefg"
        tcifra = new String(enc);
    }

    /**
     * Metodo para descifrar texto cifrado en rc6 solo con la llave
     *
     * @param key Cadena de llave exacta con la que fue cifrada
     */
    public void descifrar(String key) {
        dec = RC6.desencriptar(enc, key.getBytes());
        tdesci = new String(dec);
    }

    /**
     * Metodo para descifrar texto cifrado en rc6
     *
     * @param key Cadena de llave exacta con la que fue cifrada
     * @param textoCifrado Cadena de texto cifrada en rc6
     */
    public void descifrar(String textoCifrado, String key) {
        dec = RC6.desencriptar(textoCifrado.getBytes(), key.getBytes());
        tdesci = new String(dec);
    }

    /**
     * Muestra el texto cifrado en rc6
     */
    public String getTcifra() {
        return tcifra;
    }

    /**
     * Muestra el texto descifrado en rc6
     */
    public String getTdesci() {
        return tdesci;
    }

}
