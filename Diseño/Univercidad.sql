-- ------------------------------------------------------------------------------------------------
--                                Base de Datos: Universidad
-- ------------------------------------------------------------------------------------------------
-- Este script crea todas las tablas necesarias para modelar una universidad completa, incluyendo:
--   • Delegaciones (sedes físicas/administrativas)
--   • Facultades (pertenecientes a delegaciones)
--   • Carreras (pertenecientes a facultades)
--   • Materias (pertenecientes a carreras), con correlatividades y planes de estudio
--   • Personas (supertipo), estudiantes y empleados (subtipos)
--   • Profesores y administrativos (subtipos de empleado)
--   • Clases y exámenes, con horarios y notas separados
--   • Trabajos (asignaciones diarias de empleados a delegaciones)
--   • Usuarios del sistema (vinculados a personas)
--   • Auditoría (created_at, updated_at) en cada tabla para seguimiento de cambios
--   • Particionamiento de tablas muy grandes (ejemplos para clase y examen)
--   • Índices compuestos optimizados para consultas frecuentes
-- ------------------------------------------------------------------------------------------------

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS,    UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE,
    SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
              NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ------------------------------------------------------------------------------------------------
-- 1. Crear esquema
-- ------------------------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Universidad`;
USE `Universidad`;

-- ------------------------------------------------------------------------------------------------
-- 2. Tabla: delegacion
--    Representa una sede o delegación (ubicación física/administrativa).
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `delegacion` (
  `iddelegacion`  VARCHAR(38)    NOT NULL,   -- UUID o identificador único
  `nombre`        VARCHAR(45)    NOT NULL,   -- Nombre de la delegación
  `ubicacion`     VARCHAR(100)   NOT NULL,   -- Dirección exacta
  `ciudad`        VARCHAR(100)   NOT NULL,   -- Ciudad
  `provincia`     VARCHAR(35)    NOT NULL,   -- Provincia o región
  `codigo_postal` VARCHAR(10)    NOT NULL,   -- Código postal como texto
  `email`         VARCHAR(100)   NOT NULL,   -- Correo de contacto
  `telefono`      VARCHAR(20)    NOT NULL,   -- Teléfono principal
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`iddelegacion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 3. Tabla: facultad
--    Cada facultad está asociada a una delegación.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `facultad` (
  `idfacultad`      INT            NOT NULL AUTO_INCREMENT,  -- Identificador auto-incremental
  `delegacion_id`   VARCHAR(38)    NOT NULL,                 -- FK a delegacion.iddelegacion
  `nombre`          VARCHAR(100)   NOT NULL,                 -- Nombre oficial de la facultad
  `descripcion`     VARCHAR(200)   NOT NULL,                 -- Descripción breve
  `email_contacto`  VARCHAR(60)    NOT NULL,                 -- Correo institucional
  `telefono`        VARCHAR(20)    NOT NULL,                 -- Teléfono principal
  `decano`          VARCHAR(100)   NOT NULL,                 -- Nombre del decano actual
  `imagen_logo_url` VARCHAR(1000)  NULL,                     -- URL del logo institucional
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idfacultad`),
  INDEX `idx_facultad_delegacion` (`delegacion_id` ASC),
  CONSTRAINT `fk_facultad_delegacion`
    FOREIGN KEY (`delegacion_id`)
    REFERENCES `delegacion` (`iddelegacion`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 4. Tabla: carrera
--    Define las carreras académicas que ofrece cada facultad.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `carrera` (
  `idcarrera`           VARCHAR(38)    NOT NULL,   -- UUID o identificador único
  `facultad_id`         INT            NOT NULL,   -- FK a facultad.idfacultad
  `titulo`              VARCHAR(45)    NOT NULL,   -- Nombre de la carrera (ej: "Ing. en Sistemas")
  `tituloIntermedio`    VARCHAR(45)    NULL,       -- Título intermedio (ej: "Analista en Sistemas")
  `creditoCarrera`      INT            NOT NULL,   -- Créditos totales requeridos
  `descripcion`         VARCHAR(200)   NOT NULL,   -- Descripción del plan de estudios
  `modalidad`           ENUM('presencial','virtual','mixta') NOT NULL, -- Modalidad
  `cantidad_materias`   INT            NOT NULL,   -- Total de materias en el plan
  `carga_horaria_total` INT            NOT NULL,   -- Carga horaria total en horas
  `plan_estudios_url`   VARCHAR(2083)  NULL,       -- URL al PDF o página oficial
  `resolucion_oficial`  VARCHAR(100)   NOT NULL,   -- Resolución ministerial o similar
  `created_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcarrera`),
  INDEX `idx_carrera_facultad` (`facultad_id` ASC),
  CONSTRAINT `fk_carrera_facultad`
    FOREIGN KEY (`facultad_id`)
    REFERENCES `facultad` (`idfacultad`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 5. Tabla: materia
--    Asignaturas que componen las carreras. Incluye correlatividades y atributos adicionales.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materia` (
  `idmateria`      VARCHAR(38)    NOT NULL,   -- UUID o identificador único
  `carrera_id`     VARCHAR(38)    NOT NULL,   -- FK a carrera.idcarrera
  `codigo`         VARCHAR(20)    NOT NULL,   -- Código oficial (ej: "MAT101")
  `nombre`         VARCHAR(100)   NOT NULL,   -- Nombre completo (ej: "Álgebra I")
  `descripcion`    TEXT           NULL,       -- Descripción detallada
  `credito`        INT            NOT NULL,   -- Créditos que aporta
  `opcional`       TINYINT(1)     NOT NULL DEFAULT 0,   -- 0: obligatoria, 1: optativa
  `horas_totales`  INT            NOT NULL,   -- Horas totales de cursada
  `anio`           INT            NOT NULL,   -- Año sugerido dentro de la carrera
  `semestre`       ENUM('1','2')  NOT NULL,   -- 1° o 2° semestre
  `tipo`           ENUM('obligatoria','optativa') NOT NULL,
  `modalidad`      ENUM('presencial','virtual','mixta') NOT NULL,
  `estado`         ENUM('activa','inactiva') NOT NULL DEFAULT 'activa',
  `created_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmateria`),
  UNIQUE INDEX `uidx_materia_codigo` (`codigo` ASC),
  INDEX `idx_materia_carrera` (`carrera_id` ASC),
  CONSTRAINT `fk_materia_carrera`
    FOREIGN KEY (`carrera_id`)
    REFERENCES `carrera` (`idcarrera`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `chk_materia_opcional`
    CHECK (`opcional` IN (0,1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 6. Tabla: correlatividad
--    Define requisitos previos (correlativas) entre materias.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `correlatividad` (
  `idcorrelativa`   INT            NOT NULL AUTO_INCREMENT,  -- Identificador único auto-incremental
  `materia_id`      VARCHAR(38)    NOT NULL,   -- FK a materia.idmateria (la que exige)
  `requisito_id`    VARCHAR(38)    NOT NULL,   -- FK a materia.idmateria (la que se requiere)
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcorrelativa`),
  INDEX `idx_corr_materia` (`materia_id` ASC),
  INDEX `idx_corr_requisito` (`requisito_id` ASC),
  CONSTRAINT `fk_corr_materia`
    FOREIGN KEY (`materia_id`)
    REFERENCES `materia` (`idmateria`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_corr_requisito`
    FOREIGN KEY (`requisito_id`)
    REFERENCES `materia` (`idmateria`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 7. Tabla: plan_estudio
--    Maneja múltiples versiones de planes de estudio por carrera.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `plan_estudio` (
  `idplan`         INT            NOT NULL AUTO_INCREMENT,  -- Identificador único
  `carrera_id`     VARCHAR(38)    NOT NULL,   -- FK a carrera.idcarrera
  `version`        VARCHAR(20)    NOT NULL,   -- Ej: "2023", "2024"
  `descripcion`    TEXT           NULL,       -- Descripción de la versión del plan
  `fecha_creacion` DATE           NOT NULL,   -- Fecha de creación de este plan
  `created_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idplan`),
  INDEX `idx_plan_carrera` (`carrera_id` ASC),
  CONSTRAINT `fk_plan_carrera`
    FOREIGN KEY (`carrera_id`)
    REFERENCES `carrera` (`idcarrera`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 8. Tabla: persona (supertipo)
--    Datos básicos de todas las personas en el sistema: estudiantes y empleados.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `persona` (
  `idpersona`           VARCHAR(38)    NOT NULL,                 -- UUID o identificador único
  `nombre`              VARCHAR(45)    NOT NULL,                 -- Nombre de pila
  `apellido`            VARCHAR(45)    NOT NULL,                 -- Apellido
  `fechaNacimiento`     DATE           NOT NULL,                 -- Fecha de nacimiento
  `dni`                 VARCHAR(20)    NOT NULL,                 -- Documento como texto
  `email`               VARCHAR(80)    NOT NULL,                 -- Correo electrónico
  `telefono`            VARCHAR(20)    NOT NULL,                 -- Teléfono principal
  `domicilio`           VARCHAR(100)   NOT NULL,                 -- Domicilio completo
  `telefonoAlternativo` VARCHAR(20)    NULL,                     -- Teléfono secundario (opcional)
  `genero`              ENUM('M','F','Otro') NOT NULL,            -- Género
  `discapacidad`        VARCHAR(100)   NULL,                     -- Descripción de discapacidad (si aplica)
  `fotoPerfilUrl`       VARCHAR(2083)  NULL,                     -- URL a foto de perfil
  `created_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `uidx_persona_dni` (`dni` ASC),
  PRIMARY KEY (`idpersona`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 9. Tabla: estudiante (subtipo de persona)
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `estudiante` (
  `idpersona`         VARCHAR(38)    NOT NULL,   -- FK a persona.idpersona
  `credito`           INT            NOT NULL DEFAULT 0,     -- Créditos acumulados
  `notaPromedio`      DECIMAL(3,2)   NOT NULL DEFAULT 0.00,  -- Promedio de calificaciones
  `carrera_id`        VARCHAR(38)    NOT NULL,   -- FK a carrera.idcarrera
  `materiasAprobadas` INT            NOT NULL DEFAULT 0,     -- Cantidad de materias aprobadas
  `fechaIngreso`      DATE           NOT NULL,   -- Fecha de ingreso a la universidad
  `estadoAcademico`   ENUM('ACTIVO','EGRESADO','REGULAR','LIBRE') NOT NULL,  -- Estado actual
  `becado`            TINYINT(1)     NULL,        -- 1 si tiene beca, 0 si no (NULL si no aplica)
  `created_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpersona`),
  CONSTRAINT `fk_estudiante_persona`
    FOREIGN KEY (`idpersona`)
    REFERENCES `persona` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_estudiante_carrera`
    FOREIGN KEY (`carrera_id`)
    REFERENCES `carrera` (`idcarrera`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 10. Tabla: empleado (subtipo de persona)
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleado` (
  `persona`            VARCHAR(38)    NOT NULL,   -- FK a persona.idpersona
  `titulo`             VARCHAR(50)    NULL DEFAULT NULL,  -- Título académico
  `fechaIngreso`       DATE           NOT NULL,   -- Fecha de contratación
  `salario`            DECIMAL(10,2)  NOT NULL,   -- Salario mensual
  `situacionLaboral`   VARCHAR(60)    NOT NULL,   -- Ej: "activo", "licencia"
  `created_at`         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`persona`),
  CONSTRAINT `fk_empleado_persona`
    FOREIGN KEY (`persona`)
    REFERENCES `persona` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 11. Tabla: profesor (subtipo de empleado)
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesor` (
  `empleado_id`         VARCHAR(38)    NOT NULL,   -- FK a empleado.persona
  `horaInicioDisponible` TIME           NOT NULL,   -- Hora de inicio de disponibilidad
  `horaFinDisponible`    TIME           NOT NULL,   -- Hora de fin de disponibilidad
  `created_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empleado_id`),
  CONSTRAINT `fk_profesor_empleado`
    FOREIGN KEY (`empleado_id`)
    REFERENCES `empleado` (`persona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 12. Tabla: administrativo (subtipo de empleado)
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `administrativo` (
  `empleado_id`    VARCHAR(38)    NOT NULL,     -- FK a empleado.persona
  `sector`         VARCHAR(45)    NOT NULL,     -- Ej: "Administración"
  `departamento`   VARCHAR(45)    NOT NULL,     -- Ej: "Tesorería"
  `legajo`         INT            NOT NULL,     -- Número de legajo único
  `cargo`          VARCHAR(45)    NOT NULL,     -- Ej: "Contador"
  `estado`         ENUM('activo','licencia','baja') NOT NULL DEFAULT 'activo',
  `turno`          ENUM('mañana','tarde','noche') NOT NULL,
  `created_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empleado_id`),
  UNIQUE INDEX `uidx_administrativo_legajo` (`legajo` ASC),
  CONSTRAINT `fk_administrativo_empleado`
    FOREIGN KEY (`empleado_id`)
    REFERENCES `empleado` (`persona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 13. Tabla: dia
--     Calendario lectivo/laboral para controlar feriados y fines de semana.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dia` (
  `fecha`        DATE           NOT NULL,     -- Fecha específica
  `nombreDia`    VARCHAR(35)    NOT NULL,     -- Nombre del día (ej: "Lunes")
  `diaLaboral`   TINYINT(1)     NOT NULL,     -- 1: laboral, 0: no laboral
  `created_at`   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`fecha`),
  CONSTRAINT `chk_dia_laboral`
    CHECK (`diaLaboral` IN (0,1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 14. Tabla: clase
--     Registra la cursada de una materia por estudiante en un día específico.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clase` (
  `idclase`         VARCHAR(38)    NOT NULL,   -- UUID único de la clase
  `estudiante_id`   VARCHAR(38)    NOT NULL,   -- FK a estudiante.idpersona
  `dia`             DATE           NOT NULL,   -- Fecha de la clase
  `profesor_id`     VARCHAR(38)    NOT NULL,   -- FK a profesor.empleado_id
  `aula`            VARCHAR(10)    NOT NULL,   -- Identificador de aula
  `materia_id`      VARCHAR(38)    NOT NULL,   -- FK a materia.idmateria
  `numeroAlumnos`   INT            NOT NULL,   -- Cantidad de alumnos presentes
  `horaEntrada`     TIME           NOT NULL,   -- Hora de inicio
  `horaSalida`      TIME           NOT NULL,   -- Hora de fin
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idclase`),
  INDEX `idx_clase_estudiante` (`estudiante_id` ASC),
  INDEX `idx_clase_profesor`   (`profesor_id` ASC),
  INDEX `idx_clase_materia`    (`materia_id` ASC),
  INDEX `idx_clase_dia`        (`dia` ASC),
  CONSTRAINT `fk_clase_estudiante`
    FOREIGN KEY (`estudiante_id`)
    REFERENCES `estudiante` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_clase_dia`
    FOREIGN KEY (`dia`)
    REFERENCES `dia` (`fecha`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_clase_profesor`
    FOREIGN KEY (`profesor_id`)
    REFERENCES `profesor` (`empleado_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_clase_materia`
    FOREIGN KEY (`materia_id`)
    REFERENCES `materia` (`idmateria`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8
-- Particionamiento por año en el campo `dia` para mejorar performance de consultas históricas:
PARTITION BY RANGE (YEAR(dia)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION pMax VALUES LESS THAN MAXVALUE
);

-- ------------------------------------------------------------------------------------------------
-- 15. Tabla: horario_clase
--     Guarda horarios específicos de las clases para separar datos de asistencia de notas.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `horario_clase` (
  `idhorario`      VARCHAR(38)    NOT NULL,   -- UUID único del horario
  `idclase`        VARCHAR(38)    NOT NULL,   -- FK a clase.idclase
  `dia`            DATE           NOT NULL,   -- Fecha del horario (debe coincidir con clase.dia)
  `horaEntrada`    TIME           NOT NULL,   -- Hora de inicio de clase
  `horaSalida`     TIME           NOT NULL,   -- Hora de fin de clase
  `aula`           VARCHAR(10)    NOT NULL,   -- Aula asignada
  `created_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idhorario`),
  INDEX `idx_horario_clase_idclase` (`idclase` ASC),
  CONSTRAINT `fk_horario_clase_clase`
    FOREIGN KEY (`idclase`)
    REFERENCES `clase` (`idclase`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 16. Tabla: nota_clase
--     Almacena las notas y estados de aprobación de cada estudiante en cada clase.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nota_clase` (
  `idnota`          VARCHAR(38)    NOT NULL,   -- UUID único de la nota
  `idclase`         VARCHAR(38)    NOT NULL,   -- FK a clase.idclase
  `estudiante_id`   VARCHAR(38)    NOT NULL,   -- FK a estudiante.idpersona
  `nota`            INT            NOT NULL,   -- Nota obtenida (0–10)
  `regular`         TINYINT(1)     NOT NULL DEFAULT 0,  -- 1 si aprobó por regular
  `promocion`       TINYINT(1)     NOT NULL DEFAULT 0,  -- 1 si aprobó por promoción
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idnota`),
  INDEX `idx_nota_clase_idclase` (`idclase` ASC),
  INDEX `idx_nota_clase_estudiante` (`estudiante_id` ASC),
  CONSTRAINT `fk_nota_clase_clase`
    FOREIGN KEY (`idclase`)
    REFERENCES `clase` (`idclase`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_nota_clase_estudiante`
    FOREIGN KEY (`estudiante_id`)
    REFERENCES `estudiante` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chk_nota_clase_valor`
    CHECK (`nota` BETWEEN 0 AND 10),
  CONSTRAINT `chk_nota_clase_estados`
    CHECK (`regular` IN (0,1) AND `promocion` IN (0,1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 17. Tabla: trabajo
--     Registra la asignación diaria de un empleado a una delegación.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `trabajo` (
  `empleado_id`    VARCHAR(38)   NOT NULL,   -- FK a empleado.persona
  `delegacion_id`  VARCHAR(38)   NOT NULL,   -- FK a delegacion.iddelegacion
  `dia`            DATE          NOT NULL,   -- Fecha de la asignación
  `horaEntrada`    TIME          NOT NULL,   -- Inicio de la jornada
  `horaSalida`     TIME          NOT NULL,   -- Fin de la jornada
  `puesto`         VARCHAR(45)   NOT NULL,   -- Puesto o rol específico
  `sueldo`         DECIMAL(10,2) NOT NULL,   -- Sueldo pactado para ese día
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empleado_id`, `dia`),
  INDEX `idx_trabajo_delegacion` (`delegacion_id` ASC),
  INDEX `idx_trabajo_dia`        (`dia` ASC),
  CONSTRAINT `fk_trabajo_empleado`
    FOREIGN KEY (`empleado_id`)
    REFERENCES `empleado` (`persona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_trabajo_delegacion`
    FOREIGN KEY (`delegacion_id`)
    REFERENCES `delegacion` (`iddelegacion`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_trabajo_dia`
    FOREIGN KEY (`dia`)
    REFERENCES `dia` (`fecha`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- 18. Tabla: examen
--     Registra cada examen rendido por un estudiante.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `examen` (
  `dia`            DATE          NOT NULL,   -- Fecha del examen
  `tipo`           ENUM('Parcial','Final','Recuperatorio') NOT NULL,
  `estudiante_id`  VARCHAR(38)   NOT NULL,   -- FK a estudiante.idpersona
  `profesor_id`    VARCHAR(38)   NOT NULL,   -- FK a profesor.empleado_id
  `aula`           VARCHAR(10)   NOT NULL,   -- Aula asignada
  `horaEntrada`    TIME          NOT NULL,   -- Hora de inicio
  `horaSalida`     TIME          NOT NULL,   -- Hora de fin
  `promocion`      TINYINT(1)    NOT NULL DEFAULT 0,  -- 1 si aprobó por promoción
  `regularidad`    TINYINT(1)    NOT NULL DEFAULT 0,  -- 1 si aprobó por regularidad
  `nota`           INT           NOT NULL DEFAULT 0,  -- Calificación (0–10)
  `materia_id`     VARCHAR(38)   NOT NULL,   -- FK a materia.idmateria
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dia`, `estudiante_id`, `materia_id`),
  INDEX `idx_examen_estudiante` (`estudiante_id` ASC),
  INDEX `idx_examen_profesor`   (`profesor_id` ASC),
  INDEX `idx_examen_materia`    (`materia_id` ASC),
  CONSTRAINT `fk_examen_estudiante`
    FOREIGN KEY (`estudiante_id`)
    REFERENCES `estudiante` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_examen_profesor`
    FOREIGN KEY (`profesor_id`)
    REFERENCES `profesor` (`empleado_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_examen_materia`
    FOREIGN KEY (`materia_id`)
    REFERENCES `materia` (`idmateria`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_examen_dia`
    FOREIGN KEY (`dia`)
    REFERENCES `dia` (`fecha`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `chk_examen_nota`
    CHECK (`nota` BETWEEN 0 AND 10),
  CONSTRAINT `chk_examen_regular_promocion`
    CHECK (`regularidad` IN (0,1) AND `promocion` IN (0,1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8
-- Particionamiento por año en el campo `dia`:
PARTITION BY RANGE (YEAR(dia)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION pMax  VALUES LESS THAN MAXVALUE
);

-- ------------------------------------------------------------------------------------------------
-- 19. Tabla: usuario
--     Controla acceso al sistema, vinculado a persona.
-- ------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario`      INT            NOT NULL AUTO_INCREMENT,  -- Identificador único
  `usuario`        VARCHAR(50)    NOT NULL,   -- Nombre de usuario
  `hash_password`  VARCHAR(255)   NOT NULL,   -- Hash de la contraseña (bcrypt/SHA)
  `rol`            ENUM('admin','profesor','estudiante','administrativo') NOT NULL,  -- Rol de acceso
  `persona_id`     VARCHAR(38)    NOT NULL,   -- FK a persona.idpersona
  `created_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `uidx_usuario_nombre` (`usuario` ASC),
  INDEX `idx_usuario_persona` (`persona_id` ASC),
  CONSTRAINT `fk_usuario_persona`
    FOREIGN KEY (`persona_id`)
    REFERENCES `persona` (`idpersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

-- ------------------------------------------------------------------------------------------------
-- Restaurar modos originales
-- ------------------------------------------------------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
