import math

class EuclideanDistTracker:
    def __init__(self):
        # Хранит центральные координаты объектов
        self.center_points = {}
        # Счетчик идентификаторов
        # каждый раз, когда обнаруживается новый объект, счетчик увеличивается на единицу
        self.id_count = 0

    def update(self, objects_rect):
        # Список объектов с рамками и идентификаторами
        objects_bbs_ids = []

        # Получение центральной точки нового объекта
        for rect in objects_rect:
            x, y, w, h = rect
            cx = (x + x + w) // 2
            cy = (y + y + h) // 2

            # Проверка, был ли этот объект обнаружен ранее
            same_object_detected = False
            for id, pt in self.center_points.items():
                dist = math.hypot(cx - pt[0], cy - pt[1])

                if dist < 25:
                    self.center_points[id] = (cx, cy)
                    print(self.center_points)
                    objects_bbs_ids.append([x, y, w, h, id])
                    same_object_detected = True
                    break

            # Если новый объект обнаружен, присваиваем ему идентификатор
            if not same_object_detected:
                self.center_points[self.id_count] = (cx, cy)
                objects_bbs_ids.append([x, y, w, h, self.id_count])
                self.id_count += 1

        # Очистка словаря центральных точек от неиспользуемых идентификаторов
        new_center_points = {}
        for obj_bb_id in objects_bbs_ids:
            _, _, _, _, object_id = obj_bb_id
            center = self.center_points[object_id]
            new_center_points[object_id] = center

        # Обновление словаря, удаляя неиспользуемые идентификаторы
        self.center_points = new_center_points.copy()
        return objects_bbs_ids