import { computed, Directive, inject, Input, signal } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogCancelButtonDirective {
	private readonly _hlmBtn = inject(HlmButtonDirective, { host: true });

	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() => hlm('mt-2 sm:mt-0', this._userCls()));

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	constructor() {
		this._hlmBtn.variant = 'outline';
	}
}
