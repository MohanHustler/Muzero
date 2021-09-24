interface AzureMapAddress {
  address: {
    freeformAddress: string;
  };
}

export interface AzureMapResponse {
  results: AzureMapAddress[];
}
