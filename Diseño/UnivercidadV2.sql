-- Script para agregar solo las claves foráneas (ejecutar después de crear las tablas)
-- Fecha: 16 jun 2025
-- Versión corregida y robusta para MySQL

USE `railway`;

-- Deshabilitar verificaciones temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- IMPORTANTE: Omitimos la sección de DROP FOREIGN KEY
-- Si necesitas eliminar claves existentes, hazlo manualmente consultando:
-- SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'railway' AND CONSTRAINT_NAME LIKE 'fk_%';

-- Ahora agregar todas las claves foráneas
-- Clave foránea: facultad -> delegacion
ALTER TABLE `railway`.`facultad` 
ADD CONSTRAINT `fk_facultad_delegacion1`
  FOREIGN KEY (`delegacion_iddelegacion`)
  REFERENCES `railway`.`delegacion` (`iddelegacion`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- Clave foránea: carrera -> facultad
ALTER TABLE `railway`.`carrera` 
ADD CONSTRAINT `fk_carrera_facultad1`
  FOREIGN KEY (`facultad_idfacultad`)
  REFERENCES `railway`.`facultad` (`idfacultad`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- Clave foránea: materia -> carrera
ALTER TABLE `railway`.`materia` 
ADD CONSTRAINT `fk_materia_carrera`
  FOREIGN KEY (`carrera_id`)
  REFERENCES `railway`.`carrera` (`idcarrera`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Claves foráneas: correlatividad -> materia
ALTER TABLE `railway`.`correlatividad` 
ADD CONSTRAINT `fk_corr_materia`
  FOREIGN KEY (`materia_id`)
  REFERENCES `railway`.`materia` (`idmateria`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`correlatividad` 
ADD CONSTRAINT `fk_corr_requisito`
  FOREIGN KEY (`requisito_id`)
  REFERENCES `railway`.`materia` (`idmateria`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Clave foránea: plan_estudio -> carrera
ALTER TABLE `railway`.`plan_estudio` 
ADD CONSTRAINT `fk_plan_carrera`
  FOREIGN KEY (`carrera_id`)
  REFERENCES `railway`.`carrera` (`idcarrera`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Claves foráneas: estudiante -> persona y carrera
ALTER TABLE `railway`.`estudiante` 
ADD CONSTRAINT `fk_estudiante_persona`
  FOREIGN KEY (`idpersona`)
  REFERENCES `railway`.`persona` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`estudiante` 
ADD CONSTRAINT `fk_estudiante_carrera`
  FOREIGN KEY (`carrera_id`)
  REFERENCES `railway`.`carrera` (`idcarrera`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Clave foránea: empleado -> persona
ALTER TABLE `railway`.`empleado` 
ADD CONSTRAINT `fk_empleado_persona`
  FOREIGN KEY (`persona`)
  REFERENCES `railway`.`persona` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Clave foránea: profesor -> empleado
ALTER TABLE `railway`.`profesor` 
ADD CONSTRAINT `fk_profesor_empleado`
  FOREIGN KEY (`empleado_id`)
  REFERENCES `railway`.`empleado` (`persona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Clave foránea: administrativo -> empleado
ALTER TABLE `railway`.`administrativo` 
ADD CONSTRAINT `fk_administrativo_empleado`
  FOREIGN KEY (`empleado_id`)
  REFERENCES `railway`.`empleado` (`persona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Claves foráneas: clase
ALTER TABLE `railway`.`clase` 
ADD CONSTRAINT `fk_clase_estudiante`
  FOREIGN KEY (`estudiante_id`)
  REFERENCES `railway`.`estudiante` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`clase` 
ADD CONSTRAINT `fk_clase_dia`
  FOREIGN KEY (`dia`)
  REFERENCES `railway`.`dia` (`fecha`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`clase` 
ADD CONSTRAINT `fk_clase_profesor`
  FOREIGN KEY (`profesor_id`)
  REFERENCES `railway`.`profesor` (`empleado_id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`clase` 
ADD CONSTRAINT `fk_clase_materia`
  FOREIGN KEY (`materia_id`)
  REFERENCES `railway`.`materia` (`idmateria`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Clave foránea: horario_clase -> clase
-- NOTA: Verificar nombres de columnas reales antes de ejecutar
-- Posibles nombres: dia_clase, dia, fecha_clase
ALTER TABLE `railway`.`horario_clase` 
ADD CONSTRAINT `fk_horario_clase_clase`
  FOREIGN KEY (`idclase`)
  REFERENCES `railway`.`clase` (`idclase`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Claves foráneas: nota_clase
-- NOTA: Verificar nombres de columnas reales antes de ejecutar
ALTER TABLE `railway`.`nota_clase` 
ADD CONSTRAINT `fk_nota_clase_clase`
  FOREIGN KEY (`idclase`)
  REFERENCES `railway`.`clase` (`idclase`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`nota_clase` 
ADD CONSTRAINT `fk_nota_clase_estudiante`
  FOREIGN KEY (`estudiante_id`)
  REFERENCES `railway`.`estudiante` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Claves foráneas: trabajo
ALTER TABLE `railway`.`trabajo` 
ADD CONSTRAINT `fk_trabajo_empleado`
  FOREIGN KEY (`empleado_id`)
  REFERENCES `railway`.`empleado` (`persona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`trabajo` 
ADD CONSTRAINT `fk_trabajo_delegacion`
  FOREIGN KEY (`delegacion_id`)
  REFERENCES `railway`.`delegacion` (`iddelegacion`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`trabajo` 
ADD CONSTRAINT `fk_trabajo_dia`
  FOREIGN KEY (`dia`)
  REFERENCES `railway`.`dia` (`fecha`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Claves foráneas: examen
ALTER TABLE `railway`.`examen` 
ADD CONSTRAINT `fk_examen_estudiante`
  FOREIGN KEY (`estudiante_id`)
  REFERENCES `railway`.`estudiante` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`examen` 
ADD CONSTRAINT `fk_examen_profesor`
  FOREIGN KEY (`profesor_id`)
  REFERENCES `railway`.`profesor` (`empleado_id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`examen` 
ADD CONSTRAINT `fk_examen_materia`
  FOREIGN KEY (`materia_id`)
  REFERENCES `railway`.`materia` (`idmateria`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `railway`.`examen` 
ADD CONSTRAINT `fk_examen_dia`
  FOREIGN KEY (`dia`)
  REFERENCES `railway`.`dia` (`fecha`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Clave foránea: usuario -> persona
ALTER TABLE `railway`.`usuario` 
ADD CONSTRAINT `fk_usuario_persona`
  FOREIGN KEY (`persona_id`)
  REFERENCES `railway`.`persona` (`idpersona`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- Mensaje de confirmación
SELECT 'Todas las claves foráneas han sido agregadas exitosamente' AS resultado;