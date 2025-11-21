export default function Hello(app) {
    
    const sayHello = (req,res) => res.send('hello world!!!!')

    app.get("/hello",sayHello);//Route

    app.get('/',(req,res) =>  
    res.send('Elcome to WEb Dev'));
}