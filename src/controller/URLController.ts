import { Request, Response } from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from '../database/model/URL'

// metodo de exportação da class
// Ver se a url ja não existe
// criar o hash
//salvar a URL no banco
// Retornar a URL que agentesalvou
export class URLController {
	public async shorten(req: Request, response: Response): Promise<void> {
		const { originURL } = req.body
		const url = await URLModel.findOne({ originURL })
		if (url) {
			response.json(url)
			return
		}
		const hash = shortId.generate()
		const shortURL = `${config.API_URL}/${hash}`
		const newURL = await URLModel.create({ hash, shortURL, originURL })
		// salvar a url no banco
		// retornar a url que foi salva
		response.json(newURL)
	}

	public async redirect(req: Request, response: Response): Promise<void> {
		// pegar hash da url
		// encontrar a url original pelo hash
		// redirecionar par a url original apartir do encontrado no db
		const { hash } = req.params  // hash descontruido
		const url = await URLModel.findOne({ hash })

		
		if (url) {
			response.redirect(url.originURL)
			return
		}

		response.status(400).json({ error: 'URL not found' })
	}
}
