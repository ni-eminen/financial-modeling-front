// Define the parameter types for each model
export type GammaModelParams = {
  a: number;
  scale: number;
};

export type NormalModelParams = {
  loc: number;
  scale: number;
};

export type BinomialModelParams = {
  n: number;
  p: number;
};

export type CategoricalModelParams = {
  p: number[];
  categories: string[];
  values: number[];
};

export type PoissonModelParams = {
  mu: number;
};

export type UniformModelParams = {
  loc: number;
  scale: number;
};

export type BernoulliModelParams = {
  p: number;
};

export type GeomModelParams = {
  p: number;
};

// Define a union type for ModelParams based on the model type
export type ModelParams =
  | GammaModelParams
  | BinomialModelParams
  | CategoricalModelParams
  | NormalModelParams
  | PoissonModelParams
  | UniformModelParams
  | GeomModelParams
  | BernoulliModelParams;

// Define the valid model types
export type ModelType =
  | "gamma"
  | "binom"
  | "norm"
  | "uniform"
  | "poisson"
  | "categorical"
  | "geom"
  | "bernoulli";

export type DomainType = "discrete" | "continuous" | "categorical";

export interface Quantity {
  name: string;
  type: "convolution" | "generic" | "categorical";
  operator: string;
  samples: number[];
  pdf_samples: XYSamplesNumerical;
  cdf_samples: XYSamplesNumerical;
  domain_type: DomainType;
  categories: string[];
  params: any;
}

export interface XYSamplesNumerical {
  x: number[];
  y: number[];
}

export interface XYSamplesCategorical {
  x: string[];
  y: number[];
}
