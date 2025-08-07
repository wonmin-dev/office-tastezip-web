'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { SignUpSchema } from '@/lib/schema/auth';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const TermsAgreementSection = () => {
  const [selectAll, setSelectAll] = useState(false);

  const {
    control,
    setValue,
    watch,
    formState: { isLoading },
  } = useFormContext<SignUpSchema>();

  const [marketingAgree, privacyAgree, termsAgree] = watch([
    'marketingAgree',
    'privacyAgree',
    'termsAgree',
  ]);

  useEffect(() => {
    if (marketingAgree && privacyAgree && termsAgree) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [marketingAgree, privacyAgree, termsAgree]);

  const changeSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setValue('privacyAgree', checked);
    setValue('marketingAgree', checked);
    setValue('termsAgree', checked);
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">약관 동의하기</h2>
      <div className="space-y-3">
        <div className="flex flex-row items-center gap-2">
          <Checkbox checked={selectAll} onCheckedChange={changeSelectAll} />
          <Label className="text-base font-bold">전체 동의</Label>
        </div>
        <Separator />
        <FormField
          name="termsAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span className="text-red-500">(필수)</span>서비스 이용약관 동의
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="privacyAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span className="text-red-500">(필수)</span>개인정보 수집 및 이용 동의 여부
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="marketingAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span>(선택)</span>마케팅 정보 수신 동의
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" disabled={isLoading} className="hover:cursor-pointer">
        {isLoading ? <Loader2Icon className="animate-spin" /> : '다음'}
      </Button>
    </div>
  );
};
