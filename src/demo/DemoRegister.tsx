import { useState } from 'react';

interface FormState {
  fullName: string;
  email: string;
  department: string;
  confirmed: boolean;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const DEPARTMENTS = ['Engineering', 'Operations', 'Risk', 'Customer service'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.fullName.trim().length === 0) errors.fullName = 'Full name is required.';
  if (form.email.trim().length === 0) errors.email = 'Email address is required.';
  else if (!EMAIL_PATTERN.test(form.email.trim()))
    errors.email = 'Enter a valid email address, for example name@example.org.';
  if (form.department.length === 0) errors.department = 'Select a department.';
  if (!form.confirmed) errors.confirmed = 'Confirm that this is demo data.';
  return errors;
}

const EMPTY: FormState = { fullName: '', email: '', department: '', confirmed: false };

export default function DemoRegister() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmittedName(null);
      return;
    }
    setSubmittedName(form.fullName.trim());
    setForm(EMPTY);
  }

  const errorClass = 'mt-1.5 text-sm text-bad';
  const inputClass = 'mt-1.5 w-full rounded-sm border border-line-strong px-3 py-2 text-sm';

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Register a colleague</h1>
      <p className="mt-2 text-sm text-muted">
        Nothing is stored. The form exists so the demonstration suite has validation rules to
        assert against.
      </p>

      {submittedName ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-good/30 bg-good-soft px-4 py-3 text-sm text-good"
        >
          Registration submitted for {submittedName}.
        </p>
      ) : null}

      <form noValidate onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            className={inputClass}
          />
          {errors.fullName ? (
            <p id="fullName-error" className={errorClass}>
              {errors.fullName}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClass}
          />
          {errors.email ? (
            <p id="email-error" className={errorClass}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-ink">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={(event) => setForm({ ...form, department: event.target.value })}
            aria-invalid={errors.department ? true : undefined}
            aria-describedby={errors.department ? 'department-error' : undefined}
            className={inputClass}
          >
            <option value="">Please select</option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department ? (
            <p id="department-error" className={errorClass}>
              {errors.department}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-start gap-2.5">
            <input
              id="confirmed"
              name="confirmed"
              type="checkbox"
              checked={form.confirmed}
              onChange={(event) => setForm({ ...form, confirmed: event.target.checked })}
              aria-invalid={errors.confirmed ? true : undefined}
              aria-describedby={errors.confirmed ? 'confirmed-error' : undefined}
              className="mt-1"
            />
            <label htmlFor="confirmed" className="text-sm text-ink-soft">
              I confirm that this is demo data and contains no personal information.
            </label>
          </div>
          {errors.confirmed ? (
            <p id="confirmed-error" className={errorClass}>
              {errors.confirmed}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Submit registration
        </button>
      </form>
    </div>
  );
}
