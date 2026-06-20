const app = require('./app');
const port = app.get('port');
app.listen(port, ()=>{
  console.log(`El servidor esta corriendo en el puerto: ${port}`);

})