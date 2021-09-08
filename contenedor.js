const fs = require("fs");

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

class Contenedor {
	constructor(ruta) {
		this.ruta = ruta;
		this.productos = [];
	}
	async getAll() {
		try {
			const contenido = await fs.promises.readFile(
				this.ruta,
				(err, data) => data
			);
			const parsed = JSON.parse(contenido);
			return parsed;
		} catch (error) {
			if (error.errno === -4058) {
				await fs.promises.writeFile(this.ruta, "[]");
			} else {
				console.log(error);
			}
		}
	}
	async save(producto) {
		console.log("producto", producto);
		try {
			this.productos = await this.getAll();
			if (isEmptyObject(this.productos)) {
				producto.id = 1;
			} else {
				producto.id = this.productos.length + 1;
			}
			this.productos.push(producto);
			await fs.promises.writeFile(
				this.ruta,
				JSON.stringify(this.productos, null, 2)
			);
			return producto.id;
		} catch (error) {
			return null;
		}
	}
	async getById(id) {
		try {
			const productos = await this.getAll();

			return (
				productos.find((producto) => producto.id.toString() === id) || null
			);
		} catch (error) {
			return null;
		}
	}
	async deleteById(id) {
		try {
			const productos = await this.getAll();
			const newArray = productos.filter(
				(producto) => producto.id.toString() !== id
			);
			console.log("newArray", newArray);
			await fs.promises.writeFile(this.ruta, JSON.stringify(newArray, null, 2));
		} catch (error) {
			return null;
		}
	}
	async deleteAll() {
		await fs.promises.writeFile(this.ruta, "[]");
	}

	updateById = async (id, newProducto) => {
		let lista = await this.getAll();

		const index = lista.findIndex((producto) => producto.id == id);

		let producto = lista[index];

		if (producto) {
			const { title, price, url } = newProducto;

			producto.title = title;
			producto.price = price;
			producto.url = url;

			lista[index] = producto;

			await fs.promises.writeFile(this.ruta, JSON.stringify(lista, null, 2));
			return await this.getById(id);
		} else {
			return null;
		}
	};
}
module.exports = Contenedor;
