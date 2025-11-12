"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  Plus,
  AlertTriangle,
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { createTreatment, updateTreatment } from "@/lib/admin/treatments-api";
import {
  uploadTreatmentImage,
  deleteTreatmentImage,
} from "@/lib/admin/storage-api";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "./confirm-dialog";
import Image from "next/image";

interface TreatmentFormData {
  name: string;
  sourceType: "Local Remedy" | "Verified Source";
  sourceInfo?: {
    authority: string;
    url: string;
    description: string;
    verificationDate: string;
  };
  preparation: string[];
  usage: string;
  dosage: string;
  warnings: string[];
  benefits: string[];
  symptoms: string[];
  imageUrl?: string;
}

interface TreatmentFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const commonBenefits = [
  "Anti-inflammatory",
  "Antioxidant",
  "Immune support",
  "Pain relief",
  "Digestive aid",
  "Stress relief",
  "Sleep support",
  "Skin health",
  "Respiratory support",
  "Heart health",
];

const commonSymptoms = [
  "Nausea",
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Digestive issues",
  "Insomnia",
  "Anxiety",
  "Joint pain",
  "Skin irritation",
  "Fatigue",
  "Difficulty breathing",
  "Muscle pain",
  "Inflammation",
];

export function TreatmentForm({
  initialData,
  isEdit = false,
}: TreatmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const [formData, setFormData] = useState<TreatmentFormData>({
    name: "",
    sourceType: "Local Remedy",
    preparation: [""],
    usage: "",
    dosage: "",
    warnings: [""],
    benefits: [],
    symptoms: [],
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [newSymptom, setNewSymptom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showDeleteImageDialog, setShowDeleteImageDialog] = useState(false);
  const [showSubmitErrorDialog, setShowSubmitErrorDialog] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        sourceType: initialData.sourceType || "Local Remedy",
        sourceInfo: initialData.sourceInfo,
        preparation: initialData.preparation || [""],
        usage: initialData.usage || "",
        dosage: initialData.dosage || "",
        warnings: initialData.warnings || [""],
        benefits: initialData.benefits || [],
        symptoms: initialData.symptoms || [],
        imageUrl: initialData.imageUrl,
      });
      if (initialData.imageUrl) {
        setExistingImageUrl(initialData.imageUrl);
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // Helper function to normalize arrays for comparison
  const normalizeArray = (arr: string[] | undefined): string[] => {
    if (!arr || arr.length === 0) return [];
    return arr.filter((item) => item.trim() !== "").sort();
  };

  // Helper function to compare two objects deeply
  const hasFormDataChanged = (
    current: TreatmentFormData,
    original: any
  ): boolean => {
    if (!original) {
      // For new treatments, check if any required field has meaningful data
      return (
        current.name.trim() !== "" ||
        current.usage.trim() !== "" ||
        current.dosage.trim() !== "" ||
        current.benefits.length > 0 ||
        current.symptoms.length > 0 ||
        current.preparation.some((p) => p.trim() !== "")
      );
    }

    // Compare name
    if ((current.name || "").trim() !== (original.name || "").trim())
      return true;

    // Compare sourceType
    if (current.sourceType !== (original.sourceType || "Local Remedy"))
      return true;

    // Compare sourceInfo (only if sourceType is Verified Source)
    if (current.sourceType === "Verified Source") {
      const currentSource: any = current.sourceInfo || {};
      const originalSource: any = original.sourceInfo || {};
      if (
        (currentSource.authority || "").trim() !==
          (originalSource.authority || "").trim() ||
        (currentSource.url || "").trim() !==
          (originalSource.url || "").trim() ||
        (currentSource.description || "").trim() !==
          (originalSource.description || "").trim() ||
        (currentSource.verificationDate || "").trim() !==
          (originalSource.verificationDate || "").trim()
      ) {
        return true;
      }
    } else {
      // If switched to Local Remedy, check if original had sourceInfo
      if (original.sourceInfo) return true;
    }

    // Compare usage
    if ((current.usage || "").trim() !== (original.usage || "").trim())
      return true;

    // Compare dosage
    if ((current.dosage || "").trim() !== (original.dosage || "").trim())
      return true;

    // Compare arrays (normalized and sorted)
    const currentPrep = normalizeArray(current.preparation);
    const originalPrep = normalizeArray(original.preparation);
    if (JSON.stringify(currentPrep) !== JSON.stringify(originalPrep))
      return true;

    const currentWarnings = normalizeArray(current.warnings);
    const originalWarnings = normalizeArray(original.warnings);
    if (JSON.stringify(currentWarnings) !== JSON.stringify(originalWarnings))
      return true;

    const currentBenefits = normalizeArray(current.benefits);
    const originalBenefits = normalizeArray(original.benefits || []);
    if (JSON.stringify(currentBenefits) !== JSON.stringify(originalBenefits))
      return true;

    const currentSymptoms = normalizeArray(current.symptoms);
    const originalSymptoms = normalizeArray(original.symptoms || []);
    if (JSON.stringify(currentSymptoms) !== JSON.stringify(originalSymptoms))
      return true;

    // Compare imageUrl (handle undefined/null cases)
    const currentImage = current.imageUrl || null;
    const originalImage = original.imageUrl || null;
    if (currentImage !== originalImage) return true;

    return false;
  };

  // Detect unsaved changes dynamically
  useEffect(() => {
    let changed = hasFormDataChanged(formData, initialData);

    // Also check if a new image file has been selected (for edit mode)
    // This means user selected a new file but hasn't uploaded it yet
    if (initialData && imageFile) {
      changed = true;
    }

    setHasChanges(changed);
  }, [formData, initialData, imageFile]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // Add event listener for all link clicks to catch navigation
    const handleLinkClick = (e: MouseEvent) => {
      if (!hasChanges) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        const href = link.getAttribute("href");
        // Skip internal anchor links and javascript links
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          e.preventDefault();
          setNavigationTarget(href);
          setShowNavigationDialog(true);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [hasChanges]);

  const validateField = (fieldName: string, value: any) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Treatment name is required";
        } else if (value.trim().length < 3) {
          newErrors.name = "Treatment name must be at least 3 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "usage":
        if (!value.trim()) {
          newErrors.usage = "Usage guidelines are required";
        } else if (value.trim().length < 10) {
          newErrors.usage = "Please provide more detailed usage guidelines";
        } else {
          delete newErrors.usage;
        }
        break;

      case "dosage":
        if (!value.trim()) {
          newErrors.dosage = "Dosage information is required";
        } else {
          delete newErrors.dosage;
        }
        break;

      case "preparation":
        const validSteps = formData.preparation.filter((p) => p.trim());
        if (validSteps.length === 0) {
          newErrors.preparation = "At least one preparation step is required";
        } else {
          delete newErrors.preparation;
        }
        break;

      case "benefits":
        if (formData.benefits.length === 0) {
          newErrors.benefits = "Please select at least one benefit";
        } else {
          delete newErrors.benefits;
        }
        break;

      case "sourceInfo":
        if (formData.sourceType === "Verified Source") {
          const info = formData.sourceInfo;
          if (!info?.authority?.trim()) {
            newErrors.sourceAuthority =
              "Authority name is required for verified sources";
          } else {
            delete newErrors.sourceAuthority;
          }

          if (!info?.url?.trim()) {
            newErrors.sourceUrl = "Source URL is required for verified sources";
          } else if (!/^https?:\/\/.+\..+/.test(info.url)) {
            newErrors.sourceUrl = "Please enter a valid URL";
          } else {
            delete newErrors.sourceUrl;
          }

          if (!info?.description?.trim()) {
            newErrors.sourceDescription =
              "Description is required for verified sources";
          } else {
            delete newErrors.sourceDescription;
          }

          if (!info?.verificationDate) {
            newErrors.sourceDate = "Verification date is required";
          } else {
            delete newErrors.sourceDate;
          }
        } else {
          delete newErrors.sourceAuthority;
          delete newErrors.sourceUrl;
          delete newErrors.sourceDescription;
          delete newErrors.sourceDate;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const fields = [
      "name",
      "usage",
      "dosage",
      "preparation",
      "benefits",
      "sourceInfo",
    ];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValid = validateField(
        field,
        formData[field as keyof TreatmentFormData]
      );
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName as keyof TreatmentFormData]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (formData.imageUrl || imagePreview) {
      setShowDeleteImageDialog(true);
    } else {
      // If there's no image to delete, just clear the state
      setImageFile(null);
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, imageUrl: undefined }));
      setHasChanges(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = ["name", "usage", "dosage", "preparation", "benefits"];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((field) => (newTouched[field] = true));
    setTouched(newTouched);

    if (!validateForm()) {
      setShowSubmitErrorDialog(true);
      return;
    }

    // Show confirmation dialog before saving
    setShowSaveConfirmation(true);
  };

  const handleSaveConfirmed = async () => {
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      let treatmentId = isEdit && initialData?.id ? initialData.id : null;

      // For new treatments, create it first to get the ID, then upload image
      // For edits, upload image first if there's a new one
      if (isEdit && initialData?.id && imageFile) {
        // Upload new image for existing treatment
        setImageUploading(true);
        try {
          imageUrl = await uploadTreatmentImage(imageFile, initialData.id);

          // Delete old image if it exists and is different
          if (existingImageUrl && existingImageUrl !== imageUrl) {
            try {
              await deleteTreatmentImage(existingImageUrl);
            } catch (error) {
              console.error("Error deleting old image:", error);
              // Don't fail the whole operation if delete fails
            }
          }
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setImageUploading(false);
          setLoading(false);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      const cleanedData = {
        ...formData,
        imageUrl,
        preparation: formData.preparation.filter((p) => p.trim()),
        warnings: formData.warnings.filter((w) => w.trim()),
        symptoms: formData.symptoms.filter((s) => s.trim()),
        // Remove sourceInfo if sourceType is Local Remedy
        sourceInfo:
          formData.sourceType === "Local Remedy"
            ? undefined
            : formData.sourceInfo,
      };

      if (isEdit && initialData?.id) {
        const updatedTreatment = await updateTreatment(
          initialData.id,
          cleanedData
        );
        toast({
          title: "Success",
          description: "Treatment updated successfully",
        });
        setHasChanges(false);
        router.push(`/admin/treatments/view?id=${initialData.id}`);
      } else {
        // Create new treatment first
        const newTreatment = await createTreatment(cleanedData);
        treatmentId = newTreatment.id;

        // Upload image after creating treatment (so we have the real ID)
        if (imageFile) {
          setImageUploading(true);
          try {
            imageUrl = await uploadTreatmentImage(imageFile, newTreatment.id);
            // Update treatment with image URL
            await updateTreatment(newTreatment.id, { imageUrl });
          } catch (error) {
            console.error("Error uploading image:", error);
            toast({
              title: "Warning",
              description:
                "Treatment created but image upload failed. You can add the image later.",
              variant: "default",
            });
          } finally {
            setImageUploading(false);
          }
        }

        toast({
          title: "Success",
          description: "Treatment created successfully",
        });
        setHasChanges(false);
        router.push(`/admin/treatments/view?id=${newTreatment.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} treatment`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      router.back();
    }
  };

  const addPreparationStep = () => {
    setFormData((prev) => ({
      ...prev,
      preparation: [...prev.preparation, ""],
    }));
  };

  const removePreparationStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      preparation: prev.preparation.filter((_, i) => i !== index),
    }));
    validateField("preparation", formData.preparation);
  };

  const updatePreparationStep = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      preparation: prev.preparation.map((step, i) =>
        i === index ? value : step
      ),
    }));
  };

  const addWarning = () => {
    setFormData((prev) => ({
      ...prev,
      warnings: [...prev.warnings, ""],
    }));
  };

  const removeWarning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      warnings: prev.warnings.filter((_, i) => i !== index),
    }));
  };

  const updateWarning = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      warnings: prev.warnings.map((warning, i) =>
        i === index ? value : warning
      ),
    }));
  };

  const toggleBenefit = (benefit: string) => {
    // Case-insensitive check for existing benefit
    const existingBenefit = formData.benefits.find(
      (b) => b.toLowerCase() === benefit.toLowerCase()
    );

    setFormData((prev) => ({
      ...prev,
      benefits: existingBenefit
        ? prev.benefits.filter((b) => b.toLowerCase() !== benefit.toLowerCase())
        : [...prev.benefits, benefit],
    }));
    setTimeout(() => validateField("benefits", formData.benefits), 0);
  };

  const addCustomBenefit = () => {
    const benefit = newBenefit.trim();
    // Normalize benefit name to prevent duplicates (case-insensitive check)
    const normalizedBenefit =
      benefit.charAt(0).toUpperCase() + benefit.slice(1).toLowerCase();

    if (
      benefit &&
      !formData.benefits.some((b) => b.toLowerCase() === benefit.toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, normalizedBenefit],
      }));
      setNewBenefit("");
      validateField("benefits", formData.benefits);
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter(
        (b) => b.toLowerCase() !== benefit.toLowerCase()
      ),
    }));
    validateField("benefits", formData.benefits);
  };

  const toggleSymptom = (symptom: string) => {
    // Case-insensitive check for existing symptom
    const existingSymptom = formData.symptoms.find(
      (s) => s.toLowerCase() === symptom.toLowerCase()
    );

    setFormData((prev) => ({
      ...prev,
      symptoms: existingSymptom
        ? prev.symptoms.filter((s) => s.toLowerCase() !== symptom.toLowerCase())
        : [...prev.symptoms, symptom],
    }));
  };

  const addCustomSymptom = () => {
    const symptom = newSymptom.trim();
    // Normalize symptom name to prevent duplicates (case-insensitive check)
    const normalizedSymptom =
      symptom.charAt(0).toUpperCase() + symptom.slice(1).toLowerCase();

    if (
      symptom &&
      !formData.symptoms.some((s) => s.toLowerCase() === symptom.toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, normalizedSymptom],
      }));
      setNewSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter(
        (s) => s.toLowerCase() !== symptom.toLowerCase()
      ),
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Unsaved Changes</strong> - You have unsaved changes. Make
              sure to save before leaving this page.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Treatment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      if (touched.name) validateField("name", e.target.value);
                    }}
                    onBlur={() => handleFieldBlur("name")}
                    className={
                      errors.name && touched.name ? "border-red-500" : ""
                    }
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Treatment Image</Label>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                          <Image
                            src={imagePreview}
                            alt="Treatment preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Label
                            htmlFor="image-upload"
                            className="cursor-pointer flex-1"
                          >
                            <div className="w-full">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                disabled={imageUploading || loading}
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Change Image
                              </Button>
                            </div>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="text-red-600 hover:text-red-700"
                            disabled={imageUploading || loading}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={imageUploading || loading}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                        >
                          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                          <span className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload an image
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </span>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={imageUploading || loading}
                        />
                      </div>
                    )}
                    {imageUploading && (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        Uploading image...
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Source Type</Label>
                  <Select
                    value={formData.sourceType}
                    onValueChange={(
                      value: "Local Remedy" | "Verified Source"
                    ) => {
                      setFormData((prev) => ({
                        ...prev,
                        sourceType: value,
                        // Clear sourceInfo when switching to Local Remedy
                        sourceInfo:
                          value === "Local Remedy"
                            ? undefined
                            : prev.sourceInfo,
                      }));
                      validateField("sourceInfo", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Local Remedy">Local Remedy</SelectItem>
                      <SelectItem value="Verified Source">
                        Verified Source
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage">Usage Guidelines *</Label>
                    <Textarea
                      id="usage"
                      value={formData.usage}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          usage: e.target.value,
                        }));
                        if (touched.usage)
                          validateField("usage", e.target.value);
                      }}
                      onBlur={() => handleFieldBlur("usage")}
                      className={
                        errors.usage && touched.usage ? "border-red-500" : ""
                      }
                      rows={3}
                    />
                    {errors.usage && touched.usage && (
                      <p className="text-red-500 text-sm">{errors.usage}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Textarea
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          dosage: e.target.value,
                        }));
                        if (touched.dosage)
                          validateField("dosage", e.target.value);
                      }}
                      onBlur={() => handleFieldBlur("dosage")}
                      className={
                        errors.dosage && touched.dosage ? "border-red-500" : ""
                      }
                      rows={3}
                    />
                    {errors.dosage && touched.dosage && (
                      <p className="text-red-500 text-sm">{errors.dosage}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Source Information (for Verified Sources) */}
            {formData.sourceType === "Verified Source" && (
              <Card>
                <CardHeader>
                  <CardTitle>Source Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="authority">Authority *</Label>
                    <Input
                      id="authority"
                      value={formData.sourceInfo?.authority || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sourceInfo: {
                            ...prev.sourceInfo!,
                            authority: e.target.value,
                          },
                        }));
                        if (touched.sourceAuthority)
                          validateField("sourceInfo", e.target.value);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({
                          ...prev,
                          sourceAuthority: true,
                        }));
                        validateField("sourceInfo", formData.sourceInfo);
                      }}
                      className={
                        errors.sourceAuthority && touched.sourceAuthority
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sourceAuthority && touched.sourceAuthority && (
                      <p className="text-red-500 text-sm">
                        {errors.sourceAuthority}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sourceUrl">Official URL *</Label>
                    <Input
                      id="sourceUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.sourceInfo?.url || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sourceInfo: {
                            ...prev.sourceInfo!,
                            url: e.target.value,
                          },
                        }));
                        if (touched.sourceUrl)
                          validateField("sourceInfo", formData.sourceInfo);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, sourceUrl: true }));
                        validateField("sourceInfo", formData.sourceInfo);
                      }}
                      className={
                        errors.sourceUrl && touched.sourceUrl
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sourceUrl && touched.sourceUrl && (
                      <p className="text-red-500 text-sm">{errors.sourceUrl}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sourceDescription">Description *</Label>
                    <Textarea
                      id="sourceDescription"
                      value={formData.sourceInfo?.description || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sourceInfo: {
                            ...prev.sourceInfo!,
                            description: e.target.value,
                          },
                        }));
                        if (touched.sourceDescription)
                          validateField("sourceInfo", formData.sourceInfo);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({
                          ...prev,
                          sourceDescription: true,
                        }));
                        validateField("sourceInfo", formData.sourceInfo);
                      }}
                      rows={3}
                      className={
                        errors.sourceDescription && touched.sourceDescription
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sourceDescription && touched.sourceDescription && (
                      <p className="text-red-500 text-sm">
                        {errors.sourceDescription}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verificationDate">
                      Verification Date *
                    </Label>
                    <Input
                      id="verificationDate"
                      type="date"
                      value={formData.sourceInfo?.verificationDate || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sourceInfo: {
                            ...prev.sourceInfo!,
                            verificationDate: e.target.value,
                          },
                        }));
                        if (touched.sourceDate)
                          validateField("sourceInfo", formData.sourceInfo);
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, sourceDate: true }));
                        validateField("sourceInfo", formData.sourceInfo);
                      }}
                      className={
                        errors.sourceDate && touched.sourceDate
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.sourceDate && touched.sourceDate && (
                      <p className="text-red-500 text-sm">
                        {errors.sourceDate}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preparation Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Preparation Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.preparation.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Step ${index + 1}`}
                        value={step}
                        onChange={(e) => {
                          updatePreparationStep(index, e.target.value);
                          if (touched.preparation)
                            validateField("preparation", formData.preparation);
                        }}
                        onBlur={() => {
                          setTouched((prev) => ({
                            ...prev,
                            preparation: true,
                          }));
                          validateField("preparation", formData.preparation);
                        }}
                      />
                    </div>
                    {formData.preparation.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePreparationStep(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPreparationStep}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
                {errors.preparation && touched.preparation && (
                  <p className="text-red-500 text-sm">{errors.preparation}</p>
                )}
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card>
              <CardHeader>
                <CardTitle>Warnings & Precautions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.warnings.map((warning, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={`Warning ${index + 1}`}
                        value={warning}
                        onChange={(e) => updateWarning(index, e.target.value)}
                      />
                    </div>
                    {formData.warnings.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWarning(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addWarning}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Warning
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Benefits *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {commonBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={() => toggleBenefit(benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">
                        {benefit}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Custom benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addCustomBenefit())
                    }
                  />
                  <Button type="button" onClick={addCustomBenefit} size="sm">
                    Add
                  </Button>
                </div>

                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.benefits.map((benefit) => (
                      <Badge
                        key={benefit}
                        variant="secondary"
                        className="text-xs"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeBenefit(benefit)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {errors.benefits && touched.benefits && (
                  <p className="text-red-500 text-sm">{errors.benefits}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => toggleSymptom(symptom)}
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Custom symptom..."
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addCustomSymptom())
                    }
                  />
                  <Button type="button" onClick={addCustomSymptom} size="sm">
                    Add
                  </Button>
                </div>

                {formData.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.symptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="text-xs"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(symptom)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Treatment"
                  : "Create Treatment"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={() => {
          setHasChanges(false);
          router.back();
        }}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to leave? All changes will be lost."
      />

      {/* Navigation Confirmation Dialog */}
      <ConfirmDialog
        open={showNavigationDialog}
        onOpenChange={setShowNavigationDialog}
        onConfirm={() => {
          setHasChanges(false);
          if (navigationTarget) {
            router.push(navigationTarget);
          }
        }}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave this page? All changes will be lost."
      />

      {/* Delete Image Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteImageDialog}
        onOpenChange={setShowDeleteImageDialog}
        onConfirm={() => {
          setImageFile(null);
          setImagePreview(null);
          setFormData((prev) => ({ ...prev, imageUrl: undefined }));
          setHasChanges(true);
        }}
        title="Delete Image"
        description="Are you sure you want to remove this image? This action cannot be undone."
      />

      {/* Submit Error Confirmation Dialog */}
      <ConfirmDialog
        open={showSubmitErrorDialog}
        onOpenChange={setShowSubmitErrorDialog}
        onConfirm={() => {
          // User acknowledged the errors, close the dialog
        }}
        title="Validation Errors"
        description="Please fix all validation errors before submitting the form. Check the fields marked in red."
        customContent={
          <div className="mt-4">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="text-red-600">
                  {field}: {error}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Save Confirmation Dialog */}
      <ConfirmDialog
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
        onConfirm={handleSaveConfirmed}
        title={isEdit ? "Update Treatment" : "Create Treatment"}
        description={`Are you sure you want to ${
          isEdit ? "update" : "create"
        } this treatment?`}
      />
    </>
  );
}
