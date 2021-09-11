const fs = require("fs");

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

class Contenedor {
	constructor(ruta) {
		this.ruta = ruta;
		this.productos = [];
		this.carritos = [];
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
				producto.id = this.productos[this.productos.length - 1].id + 1;
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
			const objetos = await this.getAll();
			console.log("carts", objetos);

			return objetos.find((objeto) => objeto.id.toString() === id) || null;
		} catch (error) {
			return null;
		}
	}
	async deleteById(id) {
		try {
			const objetos = await this.getAll();
			const newArray = objetos.filter((objeto) => objeto.id.toString() !== id);
			console.log("newArray", newArray);
			await fs.promises.writeFile(this.ruta, JSON.stringify(newArray, null, 2));
		} catch (error) {
			return null;
		}
	}
	async deleteById_prod(id_prod, id) {
		try {
			const carts = await this.getAll();
			const cartIndex = carts.findIndex((cart) => cart.id == id);
			const carrito = carts[cartIndex];

			const productIndex = carrito.productos.findIndex(
				(product) => product.id == id_prod
			);

			carrito.productos.splice(productIndex, 1);

			await fs.promises.writeFile(this.ruta, JSON.stringify(carts, null, 2));

			return carrito;
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
	async saveCart() {
		console.log("SaveCart");
		let carrito = {};
		try {
			this.carritos = await this.getAll();
			if (isEmptyObject(this.carritos)) {
				carrito.id = 1;
				(carrito.timestamp = Date.now()), (carrito.productos = []);
			} else {
				console.log("thiscarro", this.carritos);
				(carrito.id = this.carritos[this.carritos.length - 1].id + 1),
					(carrito.timestamp = Date.now()),
					(carrito.productos = []);
			}
			this.carritos.push(carrito);
			await fs.promises.writeFile(
				this.ruta,
				JSON.stringify(this.carritos, null, 2)
			);
			return carrito;
		} catch (error) {
			return null;
		}
	}

	addProduct = async (id, body) => {
		let lista = await this.getAll();

		const index = lista.findIndex((carrito) => carrito.id == id);

		let carrito = lista[index];

		if (carrito) {
			carrito.productos.push(body);
			lista[index] = carrito;

			await fs.promises.writeFile(this.ruta, JSON.stringify(lista, null, 2));
			return carrito;
		} else {
			return null;
		}
	};
}

module.exports = Contenedor;
