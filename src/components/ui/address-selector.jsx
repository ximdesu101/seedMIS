import * as React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { getProvinces, getMunicipalities, getBarangays } from "@/utils/philippineAddresses";

export const AddressSelector = ({ 
  values = { province: "", municipality: "", barangay: "" },
  onChange,
  errors = {},
  disabled = false 
}) => {
  const [provinces] = React.useState(getProvinces());
  const [municipalities, setMunicipalities] = React.useState([]);
  const [barangays, setBarangays] = React.useState([]);

  // Update municipalities when province changes
  React.useEffect(() => {
    if (values.province) {
      const munis = getMunicipalities(values.province);
      setMunicipalities(munis);
      
      // Reset municipality and barangay if current municipality is not in new list
      if (values.municipality && !munis.includes(values.municipality)) {
        onChange({ 
          province: values.province, 
          municipality: "", 
          barangay: "" 
        });
      }
    } else {
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [values.province]);

  // Update barangays when municipality changes
  React.useEffect(() => {
    if (values.province && values.municipality) {
      const brgys = getBarangays(values.province, values.municipality);
      setBarangays(brgys);
      
      // Reset barangay if current barangay is not in new list
      if (values.barangay && !brgys.includes(values.barangay)) {
        onChange({ 
          ...values, 
          barangay: "" 
        });
      }
    } else {
      setBarangays([]);
    }
  }, [values.province, values.municipality]);

  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    onChange({ 
      province: newProvince, 
      municipality: "", 
      barangay: "" 
    });
  };

  const handleMunicipalityChange = (e) => {
    const newMunicipality = e.target.value;
    onChange({ 
      ...values, 
      municipality: newMunicipality, 
      barangay: "" 
    });
  };

  const handleBarangayChange = (e) => {
    const newBarangay = e.target.value;
    onChange({ 
      ...values, 
      barangay: newBarangay 
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Province */}
      <Field>
        <FieldLabel htmlFor="province">Province</FieldLabel>
        <select
          id="province"
          value={values.province}
          onChange={handleProvinceChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#016146] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="text-red-500 text-sm mt-1">{errors.province}</p>
        )}
      </Field>

      {/* Municipality */}
      <Field>
        <FieldLabel htmlFor="municipality">Municipality</FieldLabel>
        <select
          id="municipality"
          value={values.municipality}
          onChange={handleMunicipalityChange}
          disabled={disabled || !values.province}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#016146] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        >
          <option value="">Select Municipality</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
        {errors.municipality && (
          <p className="text-red-500 text-sm mt-1">{errors.municipality}</p>
        )}
      </Field>

      {/* Barangay */}
      <Field>
        <FieldLabel htmlFor="barangay">Barangay</FieldLabel>
        <select
          id="barangay"
          value={values.barangay}
          onChange={handleBarangayChange}
          disabled={disabled || !values.municipality}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#016146] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        >
          <option value="">Select Barangay</option>
          {barangays.map((barangay) => (
            <option key={barangay} value={barangay}>
              {barangay}
            </option>
          ))}
        </select>
        {errors.barangay && (
          <p className="text-red-500 text-sm mt-1">{errors.barangay}</p>
        )}
      </Field>
    </div>
  );
};
