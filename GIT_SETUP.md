# 🔧 Configuración de Git y GitHub

## 1. Instalar Git

### Opción A: Descarga Directa
1. Ve a [git-scm.com/download/win](https://git-scm.com/download/win)
2. Descarga la versión para Windows
3. Ejecuta el instalador
4. Reinicia PowerShell después de la instalación

### Opción B: Chocolatey (si lo tienes)
```powershell
choco install git
```

### Opción C: Winget (Windows 10/11)
```powershell
winget install --id Git.Git -e --source winget
```

## 2. Verificar Instalación

Después de instalar, reinicia PowerShell y ejecuta:
```powershell
git --version
```

## 3. Configurar Git (Primera Vez)

```powershell
# Configurar tu nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu.email@ejemplo.com"

# Verificar configuración
git config --list
```

## 4. Inicializar Repositorio Local

```powershell
# Inicializar Git en tu proyecto
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Primer commit: Backend preparado para Railway"
```

## 5. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `tienda-backend`
4. Descripción: "Backend para tienda de canastas navideñas"
5. **NO** inicialices con README, .gitignore o license
6. Haz clic en "Create repository"

## 6. Conectar Repositorio Local con GitHub

```powershell
# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu nombre de usuario)
git remote add origin https://github.com/TU_USUARIO/tienda-backend.git

# Verificar que se agregó correctamente
git remote -v

# Subir el código a GitHub
git push -u origin main
```

## 7. Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Verifica que todos los archivos estén ahí
3. Verifica que no esté el archivo `.env` (debe estar en `.gitignore`)

## 8. Comandos Útiles

```powershell
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline

# Ver cambios en un archivo
git diff

# Crear una nueva rama
git checkout -b nombre-rama

# Cambiar entre ramas
git checkout nombre-rama

# Ver todas las ramas
git branch
```

## 9. Flujo de Trabajo Diario

```powershell
# 1. Ver cambios
git status

# 2. Agregar cambios
git add .

# 3. Hacer commit
git commit -m "Descripción de los cambios"

# 4. Subir cambios
git push origin main
```

## 10. Solución de Problemas

### Error: "fatal: not a git repository"
```powershell
git init
```

### Error: "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/tienda-backend.git
```

### Error: "fatal: refusing to merge unrelated histories"
```powershell
git pull origin main --allow-unrelated-histories
```

## 11. Después de Configurar Git

Una vez que tengas Git funcionando y hayas subido tu código a GitHub:

1. ✅ Repositorio en GitHub
2. ✅ Código subido
3. ✅ Continuar con el despliegue en Railway
4. ✅ Conectar Railway con tu repositorio de GitHub

## 12. Próximos Pasos

Después de configurar Git y subir a GitHub:
1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno
5. ¡Despliega tu backend!
