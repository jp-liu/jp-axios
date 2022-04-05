import { getGenerateModuleConfig } from './config'
import { generateModule } from './generate'

const config = getGenerateModuleConfig()
generateModule(config)
