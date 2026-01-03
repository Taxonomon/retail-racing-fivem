export class SpawnableVehicle {
  model: string;
  label: string;
  brand: string;
  classes: string[];

  constructor(model: string, label: string, brand: string, classes: string[]) {
    this.model = model;
    this.label = label;
    this.brand = brand;
    this.classes = classes;
  }

  static sortByLabel(vehicles: SpawnableVehicle[]) {
    return vehicles.sort((a, b) => a.label.localeCompare(b.label));
  }

  static groupByBrand(vehicles: SpawnableVehicle[]) {
    const result = new Map<string, SpawnableVehicle[]>();
    vehicles.forEach(vehicle => {
      const brand = vehicle.brand;
      result.set(
        brand,
        result.has(brand)
          ? [ ...result.get(vehicle.brand) ?? [], vehicle ]
          : [ vehicle ]
      );
    });
    return result;
  }

  static groupByClass(vehicles: SpawnableVehicle[]) {
    const result = new Map<string, SpawnableVehicle[]>();
    vehicles.forEach(vehicle => {
      vehicle.classes.forEach(clazz => {
        result.set(
          clazz,
          result.has(clazz)
            ? [ ...result.get(clazz) ?? [], vehicle ]
            : [ vehicle ]
        );
      })
    });
    return result;
  }
}
