prueba ñ eñe
á a con tilde

https://github.com/mangostaacosta/emoji-feedback
https://vercel.com/mangostaacostas-projects/emoji-feedback
https://emoji-feedback.onrender.com
https://dashboard.render.com/web/srv-d0245qbe5dus73bdkhn0/logs
https://supabase.com/dashboard/project/juqoxefjgqqhyhwglhjh/editor/17267

usar consola de GIT BASH que está en el escritorio
 

C:\Docs\rma\2019\Proyectos\smiling
cd /c/Docs/rma/2019/Proyectos/smiling
npm start

node index.js

instrucciones del aplicativo en GitHub y React
the frontend is based on React Framework (entorno) hosted in VERCEL
the bachend is based on Express.js hosted in REDNER
the database is in PostgreSQL hosted in SUPABASE
I am deploying from GITHUB

Importante sobre "back-end"
Where is /api/db-stats defined?
It’s part of your Node.js backend, so you’ll find it in your backend project, likely in:  /backend/index.js
Inside index.js, you should see something like:
app.get("/api/db-stats", (req, res) => {
  // Supabase query and emoji count logic here
});


Entonces para poder deploy cambios y arreglos
Abrir Git Bash en el escritorio
cd /c/Docs/rma/2019/Proyectos/smiling   //ir a la carpeta del proyecto
git --version    //validar que si está instalado git
git init
git add. 		//para indicar que se quiere añadir todo lo que ha cambiado
git commit -m "V7.5 arreglar doble encabezado myresults" //esto es como para darle un nombre de version a los cambios
git push 	//esto es lo que manda la nueva versión a github


