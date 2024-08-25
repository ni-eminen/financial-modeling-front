// Define the parameter types for each model
export type GammaModelParams = {
  a: number;
  scale: number;
};

export type BinomialModelParams = {
  n: number;
  p: number;
};

export type MultinomialModelParams = {
  n: number;
  p: number[];
  categories: string[];
};

// Define a union type for ModelParams based on the model type
export type ModelParams =
  | GammaModelParams
  | BinomialModelParams
  | MultinomialModelParams;

// Define the valid model types
export type ModelType = "gamma" | "binomial" | "multinomial";

export type DomainType = "discrete" | "continuous";

export interface Quantity {
  name: string;
  operator: string;
  samples: number[];
  pdf_samples: XYSamplesNumerical;
  cdf_samples: XYSamplesNumerical;
  domain_type: DomainType;
}

export interface XYSamplesNumerical {
  x: number[];
  y: number[];
}

export interface XYSamplesCategorical {
  x: string[];
  y: number[];
}
