import { expose } from 'comlink';
import generator from '../../services/generator';

const worker = {
  getAllPossiblePatterns: generator.getAllPossiblePatterns,
  filterPatterns: generator.filterPatterns,
};

export type RunGeneratorWorker = typeof worker;

expose(worker);
