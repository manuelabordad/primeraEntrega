const express = require("express");
const router = express.Router();
const routerCart = express.Router();

const Contenedor = require("./contenedor");
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(port, () => {
	console.log("server activo en http://localhost:" + port);
});

app.use("/api/productos", router);

const contenedor = new Contenedor("./productos.json");

router.get("/", async (req, res) => {
	const todos = await contenedor.getAll();

	res.send(todos);
});
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const byId = await contenedor.getById(id);
	console.log("id", id);
	console.log("byId", byId);
	res.send(byId);
});

router.post("/", async (req, res) => {
	const { body } = req;

	await contenedor.save(body);

	res.redirect("/");
});
router.delete("/:id", async (req, res) => {
	const { id } = req.params;

	const borrado = await contenedor.deleteById(id);

	if (borrado) {
		res.send({ borrado });
	} else {
		res.send("El producto que se intenta borrar no existe.");
	}
});

router.put("/:id", async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	const anterior = await contenedor.getById(id);

	const nuevo = await contenedor.updateById(id, body);

	if (anterior) {
		res.send({ anterior, nuevo });
	} else {
		res.send("El producto que se intenta actualizar no existe.");
	}
});

//CARRITO//
const contenedorCarrito = new Contenedor("./carrito.json");
app.use("/api/carrito", routerCart);

routerCart.post("/", async (req, res) => {
	console.log("ENTRAA");
	const { body } = req;

	if (await contenedorCarrito.saveCart(body)) {
		res.sendStatus(200);
	} else {
		res.sendStatus(500);
	}
});
routerCart.delete("/:id", async (req, res) => {
	const { id } = req.params;

	const borrado = await contenedorCarrito.deleteById(id);

	if (borrado) {
		res.send({ borrado });
	} else {
		res.send("El carrito buscado no existe.");
	}
});

router.post("/:id/productos", async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	let anterior = await contenedorCarrito.getById(id);

	anterior.productos = anterior.productos.push(body);

	const nuevo = await contenedorCarrito.addProduct(id, body);

	if (anterior) {
		res.send({ anterior, nuevo });
	} else {
		res.send("El producto que se intenta actualizar no existe.");
	}
});
// routerCart.get("/:id/productos", async (req, res) => {
// 	const { id } = req.params;
// 	const byId = await contenedorCarrito.getById(id);
// 	res.send(byId);
// });

// 	await contenedor.save(body);

// 	res.redirect("/");
// });
// router.delete("/:id/productos/:id_prod", async (req, res) => {
// 	const { id } = req.params;

// 	const borrado = await contenedorCarrito.deleteById(id);

// 	if (borrado) {
// 		res.send({ borrado });
// 	} else {
// 		res.send("El carrito buscado no existe.");
// 	}
// });
