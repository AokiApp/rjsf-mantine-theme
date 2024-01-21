import { Sample } from '../Sample';
import cms from './cms';
import customerInfo from './hsema';
import files from './files';
import k8spodspec from './k8spodspec';
import jsonSchema from './jsonschema';

const _samples: Record<string, Sample> = {
  'Kubernetes PodSpec': k8spodspec,
  'High school examinee management app': customerInfo,
  CMS: cms,
  Files: files,
  'JSON Schema': jsonSchema,
};

export default { ..._samples };
