# Guía: trabajar el Portal de Estudio en VS Code (Windows)

Pasos para tener el proyecto corriendo en tu PC con Windows y poder cargar
los archivos de cada ramo.

## 1. Instala lo básico (una sola vez)

Descarga e instala, en este orden:

1. **VS Code** → https://code.visualstudio.com (instalador `.exe`)
2. **Node.js LTS** → https://nodejs.org (instalador `.msi`; incluye `npm`)
3. **Git para Windows** → https://git-scm.com/download/win

> Después de instalar, cierra y vuelve a abrir VS Code para que reconozca `node` y `git`.

Para comprobar que quedó todo, abre VS Code → menú **Terminal → New Terminal**
(o pulsa `Ctrl + ñ` / `` Ctrl + ` ``) y escribe:

```powershell
node --version
git --version
```

Deberían mostrar un número de versión.

## 2. Descarga el proyecto

En la terminal de VS Code (PowerShell), colócate en una carpeta donde guardar
el proyecto (por ejemplo Documentos) y clónalo:

```powershell
cd $HOME\Documents
git clone https://github.com/alanpaulakes-droid/claude-workspace.git
cd claude-workspace
git checkout claude/nuevo-portal-estudio-k4jvud
code -r .
```

La última línea reabre VS Code ya dentro de la carpeta del proyecto.

> Alternativa con ratón: en VS Code, panel **Source Control** (`Ctrl+Shift+G`)
> → **Clone Repository** → pega `https://github.com/alanpaulakes-droid/claude-workspace.git`.
> Luego, abajo a la izquierda, cambia a la rama `claude/nuevo-portal-estudio-k4jvud`.

## 3. Instala la extensión de Claude Code

En VS Code: icono **Extensions** (`Ctrl+Shift+X`) → busca **"Claude Code"** →
**Install** → inicia sesión. Con esto Claude lee toda la carpeta del proyecto
directamente desde tu disco (no hace falta subir nada a GitHub).

## 4. Levanta el portal para verlo en vivo

En la terminal de VS Code:

```powershell
cd portal-estudio
npm install      # solo la primera vez (tarda un poco)
npm run dev
```

Verás una URL como **http://localhost:5173**. Ábrela en el navegador
(o `Ctrl + clic` sobre ella). Mientras `npm run dev` siga corriendo, cada
cambio se refleja al instante. Para detenerlo: `Ctrl + C` en la terminal.

## 5. Cómo cargar un ramo

1. Dentro de `portal-estudio`, crea una carpeta para el material, por ejemplo
   `portal-estudio\material\ramo1\`.
2. Arrastra ahí los archivos del ramo (PDF, Word, imágenes, etc.) desde el
   Explorador de Windows al panel de archivos de VS Code.
3. Dile a Claude: *"el material del primer ramo está en `material/ramo1/`"* y
   se encarga del temario, apuntes con imágenes, quizzes y flashcards.

## 6. Guardar y sincronizar cambios (Git)

- Traer los cambios que Claude sube a la rama:
  ```powershell
  git pull origin claude/nuevo-portal-estudio-k4jvud
  ```
- Subir los archivos que tú agregues:
  ```powershell
  git add .
  git commit -m "material ramo1"
  git push
  ```

## Problemas frecuentes

- **`npm` o `git` no se reconoce**: cierra y reabre VS Code (o reinicia el PC)
  para que Windows tome las nuevas rutas.
- **`code` no se reconoce en la terminal**: abre VS Code a mano y usa
  **File → Open Folder** para abrir `claude-workspace`.
- **El puerto 5173 está ocupado**: Vite elegirá otro (5174, 5175…); usa la URL
  que muestre la terminal.
- **PowerShell bloquea scripts**: si `npm` no arranca por políticas de
  ejecución, abre PowerShell como administrador y ejecuta
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
