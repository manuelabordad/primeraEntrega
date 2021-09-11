async function validateUser(req, res, next) {
	const admin = false; // O ponerle admin = false para probar si funciona

	if (admin) {
		next();
	} else {
		res.status(401).send({ error: "Usuario no autorizado" });

		//throw new Error("El usuario no es admin.");
	}
}

module.exports = { validateUser };
