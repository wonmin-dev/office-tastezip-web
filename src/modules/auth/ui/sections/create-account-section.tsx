'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SignUpSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { JOB_CATEGORIES, POSITION_CATEGORIES } from '@/modules/auth/constants';
import { organizationNamesQueryOptions } from '@/modules/auth/server/queries';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'es-toolkit';
import { ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface CreateAccountSectionProps {
  onNext: (
    nickname: string,
    organizationName: string,
    job: string,
    position: string,
    joinYear: string,
  ) => void;
  currentYear: string;
}

export const CreateAccountSection = ({ onNext, currentYear }: CreateAccountSectionProps) => {
  const { control, trigger, getValues, setValue } = useFormContext<SignUpSchema>();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const { data: organizationNames } = useQuery(organizationNamesQueryOptions({ name: keyword }));

  const proceedToNext = async () => {
    const isValid = await trigger(['nickname', 'job', 'position', 'joinYear']);

    if (isValid) {
      const nickname = getValues('nickname');
      const organizationName = getValues('organizationName');
      const job = getValues('job');
      const position = getValues('position');
      const joinYear = getValues('joinYear');

      onNext(nickname, organizationName, job, position, joinYear);
    }
  };

  const debounceSetKeyword = useCallback(
    debounce((keyword) => setKeyword(keyword), 300),
    [],
  );

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">계정 생성하기</h2>
      <FormField
        name="nickname"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>이름</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="organizationName"
        control={control}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>기업명</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-[320px] justify-between',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value || '기업명을 입력하세요.'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0">
                <Command>
                  <CommandInput
                    onValueChange={debounceSetKeyword}
                    placeholder="기업명 검색"
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>검색 결과 없음</CommandEmpty>
                    <CommandGroup>
                      {organizationNames?.map(({ id, name }) => (
                        <CommandItem
                          key={id}
                          value={id}
                          onSelect={() => {
                            setValue('organizationName', id);
                          }}
                        >
                          {name}
                        </CommandItem>
                      ))}
                      {keyword && (
                        <CommandItem
                          value={keyword}
                          onSelect={() => {
                            setValue('organizationName', keyword);
                            setOpen(false);
                          }}
                        >
                          <PlusIcon className="ml-1 size-4" />"{keyword}" 새로 추가하기
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      <FormField
        name="job"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>직무</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {JOB_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="position"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>직급</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {POSITION_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="joinYear"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>입사년도</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: Number.parseInt(currentYear) - 1950 + 1 }).map((_, i) => (
                  <SelectItem value={(1950 + i).toString()} key={i}>
                    {1950 + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={proceedToNext}>
        다음
      </Button>
    </div>
  );
};
